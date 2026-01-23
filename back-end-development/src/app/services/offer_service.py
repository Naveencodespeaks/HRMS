from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.offer import Offer
from src.app.models.candidate import Candidate
from src.app.models.job import Job
from src.app.api.offers.schemas import OfferCreate, OfferUpdate


class OfferService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================
    # ➕ CREATE OFFER
    # =====================================================
    async def create_offer(self, payload: OfferCreate) -> Offer:
        # 1️⃣ Validate candidate
        candidate = (
            await self.db.execute(
                select(Candidate).where(
                    Candidate.id == payload.candidate_id,
                    Candidate.is_active == True,
                )
            )
        ).scalar_one_or_none()

        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        # 2️⃣ Ensure no active offer exists
        active_offer = (
            await self.db.execute(
                select(Offer).where(
                    Offer.candidate_id == payload.candidate_id,
                    Offer.is_active == True,
                )
            )
        ).scalar_one_or_none()

        if active_offer:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Active offer already exists for this candidate",
            )

        # 3️⃣ Validate job (optional)
        if payload.job_id:
            job = (
                await self.db.execute(
                    select(Job).where(
                        Job.id == payload.job_id,
                        Job.status == "OPEN",
                        Job.is_active == True,
                    )
                )
            ).scalar_one_or_none()

            if not job:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or closed job",
                )

        # 4️⃣ Create offer
        offer = Offer(
            candidate_id=payload.candidate_id,
            job_id=payload.job_id,
            offered_ctc=payload.offered_ctc,
            joining_date=payload.joining_date,
            remarks=payload.remarks,
            status="PENDING_HR_APPROVAL",
            is_active=True,
        )

        self.db.add(offer)
        await self.db.commit()
        await self.db.refresh(offer)

        return offer

    # =====================================================
    # ✏️ UPDATE OFFER STATUS (HR / Candidate)
    # =====================================================
    async def update_offer(self, offer_id: UUID, payload: OfferUpdate) -> Offer:
        offer = (
            await self.db.execute(
                select(Offer).where(
                    Offer.id == offer_id,
                    Offer.is_active == True,
                )
            )
        ).scalar_one_or_none()

        if not offer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Offer not found",
            )

        offer.status = payload.status
        offer.remarks = payload.remarks

        # Auto-close offer on final decision
        if payload.status in {"OFFER_ACCEPTED", "OFFER_DECLINED", "HR_REJECTED"}:
            offer.is_active = False

        await self.db.commit()
        await self.db.refresh(offer)

        return offer

    # =====================================================
    # 📄 GET OFFER BY CANDIDATE
    # =====================================================
    async def get_offer_by_candidate(self, candidate_id: UUID):
        result = await self.db.execute(
            select(Offer)
            .where(Offer.candidate_id == candidate_id)
            .order_by(Offer.created_at.desc())
        )
        return result.scalar_one_or_none()
