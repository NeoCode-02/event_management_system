from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.database import SessionLocal
from app.models.user import User

dbearer_scheme = HTTPBearer(auto_error=False)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def get_current_user(
    token: Annotated[HTTPAuthorizationCredentials, Depends(dbearer_scheme)],
    db: db_dependency,
) -> User:
    jwt_str = token.credentials

    try:
        payload = jwt.decode(
            jwt_str,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as err:
        raise HTTPException(status_code=401, detail="Invalid token") from err

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Inactive or non-existent user")
    if not user.is_confirmed:
        raise HTTPException(status_code=401, detail="User not confirmed")
    return user


current_user_dependency = Annotated[User, Depends(get_current_user)]
