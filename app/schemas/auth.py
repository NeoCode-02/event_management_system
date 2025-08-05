from pydantic import BaseModel, EmailStr, constr
from pydantic import EmailStr


class RegisterSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class ResendEmail(BaseModel):
    email: EmailStr


class VerifyCodeSchema(BaseModel):
    email: EmailStr
    code: constr(min_length=6)


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
