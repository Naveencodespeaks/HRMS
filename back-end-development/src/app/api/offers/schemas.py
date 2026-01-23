from datetime import date, datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class OfferCreate(BaseModel):
    candidate_id: UUID
    job_id: Optional[UUID] = None
    offered_ctc: int
    joining_date: Optional[date] = None
    remarks: Optional[str] = None


class OfferUpdate(BaseModel):
    status: str = Field(..., description="HR_APPROVED / HR_REJECTED / OFFER_ACCEPTED / OFFER_DECLINED")
    remarks: Optional[str] = None


class OfferResponse(BaseModel):
    id: UUID
    candidate_id: UUID
    job_id: Optional[UUID]
    offered_ctc: int
    status: str
    joining_date: Optional[date]
    remarks: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
