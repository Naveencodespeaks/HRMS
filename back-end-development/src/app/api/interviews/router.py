from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.app.core.db import get_db
from src.app.api.interviews.schemas import (
    InterviewCreateRequest,
    InterviewUpdateRequest,
    InterviewResponse,
)
from src.app.api.interviews.service import InterviewService

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("", response_model=InterviewResponse)
async def schedule_interview(
    payload: InterviewCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    service = InterviewService(db)
    return await service.schedule_interview(payload)


@router.get("/candidate/{candidate_id}", response_model=list[InterviewResponse])
async def list_candidate_interviews(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = InterviewService(db)
    return await service.get_candidate_interviews(candidate_id)


@router.patch("/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: UUID,
    payload: InterviewUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    service = InterviewService(db)
    return await service.update_interview(interview_id, payload)
