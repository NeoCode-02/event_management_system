from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    is_active: bool
    is_confirmed: bool
    is_admin: bool

    class Config:
        orm_mode = True
