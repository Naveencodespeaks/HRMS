# # src/app/models/interview.py

# import uuid
# from sqlalchemy import (
#     Column,
#     String,
#     DateTime,
#     Text,
#     ForeignKey,
#     Integer,
# )
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.sql import func

# from src.app.core.db import Base


# class Interview(Base):
#     __tablename__ = "interviews"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

#     # 🔗 Candidate linkage
#     candidate_id = Column(
#         UUID(as_uuid=True),
#         ForeignKey("candidates.id", ondelete="CASCADE"),
#         nullable=False,
#         index=True,
#     )

#     # 🔗 Job linkage (optional but recommended)
#     job_id = Column(
#         UUID(as_uuid=True),
#         ForeignKey("jobs.id", ondelete="SET NULL"),
#         nullable=True,
#         index=True,
#     )

#     # 🔄 Interview round info
#     round_number = Column(Integer, nullable=False)  # 1,2,3,4,5
#     round_name = Column(String(50), nullable=True)  # L1, L2, HR, Manager, etc.

#     # 👤 Interviewer info
#     interviewer_name = Column(String(100), nullable=True)
#     interviewer_email = Column(String(255), nullable=True)

#     # 📊 Interview result
#     status = Column(
#         String(20),
#         nullable=False,
#         default="PENDING",
#         index=True,
#     )
#     # allowed: PENDING, PASSED, FAILED, ON_HOLD

#     feedback = Column(Text, nullable=True)

#     # 🕒 Timing
#     scheduled_at = Column(DateTime(timezone=True), nullable=True)
#     completed_at = Column(DateTime(timezone=True), nullable=True)

#     created_at = Column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         nullable=False,
#     )
#     updated_at = Column(
#         DateTime(timezone=True),
#         server_default=func.now(),
#         onupdate=func.now(),
#         nullable=False,
#     )


# interview life cycle.
# SCHEDULED
# COMPLETED
# PASSED
# FAILED
# ON_HOLD
# CANCELLED


# src/app/models/interview.py

import uuid
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Text,
    ForeignKey,
    Integer,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from src.app.core.db import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # 🔗 Candidate linkage
    candidate_id = Column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # 🔗 Job linkage
    job_id = Column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # 🔄 Interview round info
    round_number = Column(Integer, nullable=False)   # 1,2,3...
    round_name = Column(String(50), nullable=False)  # L1, L2, HR

    # 🧠 Interview type
    interview_type = Column(
        String(50),
        nullable=False,   # Technical / HR / Managerial
    )

    # 👤 Interviewer info
    interviewer_name = Column(String(100), nullable=True)
    interviewer_email = Column(String(255), nullable=True)

    # 📊 Interview result lifecycle
    status = Column(
        String(30),
        nullable=False,
        default="SCHEDULED",
        index=True,
    )
    # allowed:
    # SCHEDULED → COMPLETED → PASSED / FAILED
    # CANCELLED / ON_HOLD

    feedback = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1–5

    # 🕒 Timing
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # 🧾 Audit
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


    meeting_platform = Column(String(50), nullable=True)
    meeting_link = Column(Text, nullable=True)

    # 🎥 Recording (future-ready)
    recording_url = Column(Text, nullable=True)
    recording_status = Column(String(50), default="PENDING")
