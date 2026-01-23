from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class InterviewCreateRequest(BaseModel):
    candidate_id: UUID
    job_id: Optional[UUID]
    round_number: int = Field(..., example=1)
    round_name: Optional[str] = Field("L1")
    interview_type: Optional[str] = Field("Technical")
    interviewer_name: Optional[str]
    interviewer_email: Optional[str]
    scheduled_at: Optional[datetime]


class InterviewUpdateRequest(BaseModel):
    status: str = Field(..., example="PASSED")
    feedback: Optional[str]
    rating: Optional[int]


class InterviewResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    round_number: int
    round_name: Optional[str]
    status: str
    feedback: Optional[str]
    rating: Optional[int]
    scheduled_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class RecordingUpdateSchema(BaseModel):
    recording_url: str
