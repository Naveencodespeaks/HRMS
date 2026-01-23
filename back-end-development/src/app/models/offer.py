import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Integer,
    ForeignKey,
    Boolean,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from src.app.core.db import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # =========================
    # 🔗 CORE RELATIONS
    # =========================
    candidate_id = Column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    job_id = Column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    recruiter_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    hr_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # =========================
    # 💰 OFFER DETAILS
    # =========================
    offered_ctc = Column(Integer, nullable=False)
    joining_date = Column(DateTime(timezone=True), nullable=True)

    offer_letter_url = Column(String(500), nullable=True)

    # =========================
    # 📊 OFFER STATUS
    # =========================
    status = Column(
        String(30),
        nullable=False,
        default="DRAFT",
        index=True,
        comment="DRAFT / HR_APPROVED / SENT / ACCEPTED / REJECTED / WITHDRAWN"
    )

    remarks = Column(Text, nullable=True)

    # =========================
    # 🔐 CONTROL FLAGS
    # =========================
    is_active = Column(Boolean, default=True, nullable=False)

    # =========================
    # 🧾 AUDIT
    # =========================
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
