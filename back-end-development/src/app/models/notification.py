from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.app.core.db import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # which role should see it (admin/recruiter etc.)
    role: Mapped[str] = mapped_column(String(50), index=True)

    # notification type
    type: Mapped[str] = mapped_column(String(50), default="candidate_created", index=True)

    title: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)

    # store candidate id as string for easy linking
    entity_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)

    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
