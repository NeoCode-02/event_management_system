import uuid
from enum import Enum

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base

from .timestamp_mixin import TimeMixin


class Status(str,Enum):
    WAITLIST = "waitlist"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class Registration(Base, TimeMixin):
    __tablename__ = "registrations"
    __table_args__ = {"extend_existing": True}

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    surname: Mapped[str] = mapped_column(String, nullable=True)
    phone: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default=Status.WAITLIST)

    event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("events.id"))
    event = relationship("Event", back_populates="registrations")
