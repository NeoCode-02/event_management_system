import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base

from .timestamp_mixin import TimeMixin


class Event(Base, TimeMixin):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text)
    location: Mapped[str] = mapped_column(String)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    share_uuid: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, unique=True)
    is_public: Mapped[bool] = mapped_column(default=False)

    organizer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    organizer = relationship("User", back_populates="events")

    registrations = relationship("Registration", back_populates="event")
