from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.app.core.db import get_db
from src.app.services.offer_service import OfferService
from src.app.api.offers.schemas import OfferCreate, OfferUpdate, OfferResponse

router = APIRouter(prefix="/offers", tags=["Offers"])


@router.post("", response_model=OfferResponse, status_code=201)
async def create_offer(
    payload: OfferCreate,
    db: AsyncSession = Depends(get_db),
):
    service = OfferService(db)
    return await service.create_offer(payload)


@router.patch("/{offer_id}", response_model=OfferResponse)
async def update_offer(
    offer_id: UUID,
    payload: OfferUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = OfferService(db)
    return await service.update_offer(offer_id, payload)


@router.get("/candidate/{candidate_id}", response_model=OfferResponse | None)
async def get_candidate_offer(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OfferService(db)
    return await service.get_offer_by_candidate(candidate_id)
