from datetime import UTC, datetime, timedelta
from typing import Any

from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def create_access_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def create_refresh_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(hours=settings.REFRESH_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(
        to_encode, settings.JWT_REFRESH_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def decode_token(token: str, refresh: bool = False) -> dict[str, Any]:
    secret = settings.JWT_SECRET_KEY if not refresh else settings.JWT_REFRESH_SECRET_KEY
    try:
        payload = jwt.decode(token, secret, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except ExpiredSignatureError as err:
        raise ValueError("Token has expired") from err
    except JWTError as err:
        raise ValueError("Invalid token") from err
