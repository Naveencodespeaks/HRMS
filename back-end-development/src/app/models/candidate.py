from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
import uuid

from src.app.core.db import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    address = Column(String, nullable=True)
    highest_qualification = Column(String(150), nullable=False)
    experience_type = Column(String(20), nullable=False)  # fresher / experienced
    previous_company = Column(String(150), nullable=True)
    role = Column(String(100), nullable=True)
    company_location = Column(String(100), nullable=True)
    total_experience_years = Column(Integer, nullable=True)
    current_ctc = Column(Integer, nullable=True)
    expected_ctc = Column(Integer, nullable=False)
    notice_period_days = Column(Integer, nullable=True)
    immediate_joining = Column(Boolean, default=False, nullable=False)
    # upload_resume_path = Column(String, nullable=True)
    #linkedin_profile = Column(String, nullable=True)
    date_of_joining = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(String(100),nullable=True)
    position_id = Column(UUID(as_uuid=True),ForeignKey("positions.id", ondelete="SET NULL"),nullable=True, index=True)