from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.db import get_db
from src.app.api.hr.service import HRService
from src.app.api.hr.schemas import HRCandidateDetail

router = APIRouter(prefix="/hr", tags=["HR"])


@router.get(
    "/candidates/{candidate_id}",
    response_model=HRCandidateDetail
)
async def hr_candidate_detail(
    candidate_id: UUID,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """
    HR candidate full detail view (secure).
    """
    service = HRService(db)
    candidate, interviews, offer = await service.get_candidate_detail(
        token=token,
        candidate_id=candidate_id,
    )

    return HRCandidateDetail(
        id=candidate.id,
        full_name=f"{candidate.first_name} {candidate.last_name}",
        email=candidate.email,
        phone=candidate.phone,
        experience_type=candidate.experience_type,
        highest_qualification=candidate.highest_qualification,
        previous_company=candidate.previous_company,
        total_experience_years=candidate.total_experience_years,
        expected_ctc=candidate.expected_ctc,
        notice_period_days=candidate.notice_period_days,
        immediate_joining=candidate.immediate_joining,
        resume_url=candidate.resume_url,
        created_at=candidate.created_at,
        interviews=[
            {
                "round_number": i.round_number,
                "round_name": i.round_name,
                "interview_type": i.interview_type,
                "status": i.status,
                "feedback": i.feedback,
                "rating": i.rating,
                "scheduled_at": i.scheduled_at,
                "completed_at": i.completed_at,
            }
            for i in interviews
        ],
        offer=(
            {
                "offered_ctc": offer.offered_ctc,
                "status": offer.status,
                "joining_date": offer.joining_date,
                "remarks": offer.remarks,
            }
            if offer
            else None
        ),
    )
