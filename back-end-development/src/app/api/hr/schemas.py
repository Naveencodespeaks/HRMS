from typing import List, Optional, Literal
from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel, Field


# ==============================
# Interview Item
# ==============================
class HRInterviewItem(BaseModel):
    round_number: int
    round_name: Optional[str]
    interview_type: Optional[str]
    status: str
    feedback: Optional[str]
    rating: Optional[int]
    scheduled_at: Optional[datetime]
    completed_at: Optional[datetime]


# ==============================
# Offer Info
# ==============================
class HROfferInfo(BaseModel):
    offered_ctc: int
    status: str
    joining_date: Optional[date]   # ✅ FIXED
    remarks: Optional[str]


# ==============================
# HR Candidate Detail
# ==============================
class HRCandidateDetail(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str
    experience_type: str
    highest_qualification: str
    previous_company: Optional[str]
    total_experience_years: Optional[int]
    expected_ctc: int
    notice_period_days: Optional[int]
    immediate_joining: bool
    resume_url: Optional[str]
    created_at: datetime

    interviews: List[HRInterviewItem]
    offer: Optional[HROfferInfo]


# ==============================
# HR Decision
# ==============================
class HRDecisionRequest(BaseModel):
    action: Literal[
        "SHORTLIST",
        "REJECT",
        "HOLD",             # ✅ FIXED
        "APPROVE_OFFER",
    ]
    remarks: Optional[str] = Field(
        None,
        description="HR remarks / reason"
    )


class HRDecisionResponse(BaseModel):
    message: str
    action: str
