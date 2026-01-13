from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from uuid import uuid4, UUID

from src.app.core.db import Base

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[UUID] = mapped_column(
        primary_key=True, default=uuid4
    )

    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(String(500))

    candidate_id: Mapped[UUID] = mapped_column(nullable=True)

    role: Mapped[str] = mapped_column(String(50))  # recruiter / admin

    is_read: Mapped[bool] = mapped_column(
        Boolean, default=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
