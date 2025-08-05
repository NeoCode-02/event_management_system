from fastapi import APIRouter, HTTPException, status

from app.models.user import User
from app.schemas.auth import (
    LoginSchema,
    RegisterSchema,
    TokenSchema,
    VerifyCodeSchema,
    ResendEmail,
)
from app.schemas.user import UserOut
from app.utils.dependencies import current_user_dependency, db_dependency
from app.utils.jwt_token import create_access_token, create_refresh_token
from app.utils.password import hash_password, verify_password
from app.utils.redis import (
    retrieve_verification_code,
    delete_verification_code,
    clear_rate_limit,
)
from app.utils.tasks import send_verification_email_task
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register_user(payload: RegisterSchema, db: db_dependency):
    """
    Register a new user.  
    The very first user becomes admin and is automatically confirmed.
    Everyone else receives an e-mail verification code.
    """
    try:
   
        user_count = db.query(User).count()
        is_first_user = user_count == 0

        user = User(
            email=payload.email,
            password_hash=hash_password(payload.password),
            is_active=True,
            is_confirmed=is_first_user,
            is_admin=is_first_user,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")

    if not is_first_user:
        try:
            send_verification_email_task(payload.email)
        except Exception as e:
         
            db.delete(user)
            db.commit()
            raise HTTPException(status_code=429, detail=str(e))

    return {
        "detail": (
            "First user registered as admin and confirmed"
            if is_first_user
            else f"Verification code sent to {payload.email}"
        )
    }


@router.post("/resend-code")
def resend_verification_code(payload: ResendEmail, db: db_dependency):
    user = db.query(User).filter_by(email=payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_confirmed:
        return {"detail": "User already confirmed"}

    try:
        send_verification_email_task(payload.email)
    except Exception as e:
        raise HTTPException(status_code=429, detail=str(e))

    return {"detail": f"New verification code sent to {user.email}"}


@router.post("/verify-code/")
def verify_code(payload: VerifyCodeSchema, db: db_dependency):
    code_in_redis = retrieve_verification_code(payload.email)
    if not code_in_redis or code_in_redis != payload.code:
        raise HTTPException(
            status_code=400, detail="Invalid or expired verification code"
        )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_confirmed = True
    db.commit()


    delete_verification_code(payload.email)
    clear_rate_limit(payload.email)

    return {"detail": "Email verified successfully"}


@router.post("/login/", response_model=TokenSchema)
def login(payload: LoginSchema, db: db_dependency):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not user.is_confirmed:
        raise HTTPException(status_code=403, detail="Email not verified")

    token_data = {"sub": str(user.id), "email": user.email, "is_admin": user.is_admin}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenSchema(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.get("/me/", response_model=UserOut)
def get_me(current_user: current_user_dependency):
    return current_user


@router.delete("/delete-me/", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_account(current_user: current_user_dependency, db: db_dependency):
    db.delete(current_user)
    db.commit()
    return None  