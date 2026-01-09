from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from uuid import UUID


class CandidateBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: EmailStr
    address: Optional[str]

    highest_qualification: str
    experience_type: str  # fresher / experienced

    previous_company: Optional[str]
    role: Optional[str]
    company_location: Optional[str]
    total_experience_years: Optional[int]

    current_ctc: Optional[int]
    expected_ctc: int
    notice_period_days: Optional[int]
    immediate_joining: bool
    date_of_joining: Optional[date]


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(CandidateBase):
    pass


class CandidateResponse(CandidateBase):
    id: UUID

    class Config:
        from_attributes = True
