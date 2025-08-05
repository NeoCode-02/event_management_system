# app/schemas/attendee.py

from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.models.registration import Status


class RegistrationCreate(BaseModel):
    name: str
    surname: str | None = None
    phone: str
    email: EmailStr | None = None


class RegistrationUpdate(BaseModel):
    status: Status


class RegistrationOut(BaseModel):
    id: UUID
    name: str
    surname: str | None = None
    phone: str
    email: str | None = None
    status: Status

    class Config:
        orm_mode = True
