# src/app/models/hr_access_link.py

import uuid
from sqlalchemy import Column, DateTime, Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from src.app.core.db import Base


class HRAccessLink(Base):
    __tablename__ = "hr_access_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    candidate_id = Column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    token = Column(String(255), unique=True, nullable=False, index=True)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    is_used = Column(Boolean, default=False, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
