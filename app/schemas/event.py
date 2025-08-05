# app/schemas/event.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class EventCreate(BaseModel):
    title: str
    description: str | None = None
    location: str
    date: datetime
    is_public: bool = False


class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    date: datetime | None = None
    is_public: bool | None = None


class EventOut(BaseModel):
    id: UUID
    title: str
    description: str | None
    location: str
    date: datetime
    share_uuid: UUID
    is_public: bool

    class Config:
        orm_mode = True
