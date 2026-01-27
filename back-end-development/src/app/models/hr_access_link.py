import uuid
from sqlalchemy import Boolean 
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Integer,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func, text

from src.app.core.db import Base


class HRAccessLink(Base):
    __tablename__ = "hr_access_links"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    candidate_id = Column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    token = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # 🔍 Audit / Tracking (SAFE & NON-RESTRICTIVE)
    opened_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    opened_by = Column(
        String(255),
        nullable=True,
    )

    open_count = Column(
        Integer,
        nullable=False,
        server_default=text("0"),
    )
    is_used = Column(Boolean, default=False, nullable=False)