# src/app/models/candidate.py
from sqlalchemy import (
    Column, String, Integer, Boolean, Date, DateTime
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from src.app.core.db import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Personal info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    address = Column(String, nullable=True)

    # Education & experience
    highest_qualification = Column(String(150), nullable=False)
    experience_type = Column(String(20), nullable=False)  # fresher / experienced

    # Professional (conditional)
    previous_company = Column(String(150), nullable=True)
    role = Column(String(100), nullable=True)
    company_location = Column(String(100), nullable=True)
    total_experience_years = Column(Integer, nullable=True)

    # Compensation
    current_ctc = Column(Integer, nullable=True)
    expected_ctc = Column(Integer, nullable=False)
    notice_period_days = Column(Integer, nullable=True)
    immediate_joining = Column(Boolean, default=False)
    date_of_joining = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
