from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.db import get_db
from src.app.api.candidate_offer.service import CandidateOfferService

router = APIRouter(prefix="/offer", tags=["Candidate Offer"])


@router.post("/accept")
async def accept_offer(
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    service = CandidateOfferService(db)
    return await service.accept_offer(token)


@router.post("/reject")
async def reject_offer(
    token: str = Query(...),
    reason: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    service = CandidateOfferService(db)
    return await service.reject_offer(token, reason)
