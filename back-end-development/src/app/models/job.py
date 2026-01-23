# src/app/models/job.py

import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from src.app.core.db import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic Job Info
    title = Column(String(150), nullable=False, index=True)  # e.g., Backend Developer
    department = Column(String(100), nullable=True)  # e.g., IT / HR / Finance
    location = Column(String(100), nullable=True)  # Hyderabad, Bangalore, Remote

    employment_type = Column(String(50), nullable=True)  # Full-time / Part-time / Contract
    experience_min_years = Column(Integer, nullable=True)
    experience_max_years = Column(Integer, nullable=True)

    openings = Column(Integer, default=1, nullable=False)

    description = Column(Text, nullable=True)

    # Links
    linkedin_url = Column(String(500), nullable=True)

    # Status
    status = Column(String(20), default="OPEN", nullable=False, index=True)
    # allowed: OPEN, CLOSED, ON_HOLD

    is_active = Column(Boolean, default=True, nullable=False)

    # audit
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
