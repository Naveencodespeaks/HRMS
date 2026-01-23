from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from src.app.models.offer import Offer
from src.app.repositories.candidate_offer_token_repo import (
    CandidateOfferTokenRepository,
)


class CandidateOfferService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.token_repo = CandidateOfferTokenRepository(db)

    async def accept_offer(self, token: str):
        link = await self.token_repo.get_valid(token)

        if not link:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired offer link",
            )

        offer = await self.db.get(Offer, link.offer_id)

        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found")

        offer.status = "ACCEPTED"
        offer.responded_at = datetime.now(timezone.utc)

        await self.token_repo.mark_used(link)
        await self.db.commit()

        return {"message": "Offer accepted successfully"}

    async def reject_offer(self, token: str, reason: str | None):
        link = await self.token_repo.get_valid(token)

        if not link:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired offer link",
            )

        offer = await self.db.get(Offer, link.offer_id)

        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found")

        offer.status = "REJECTED"
        offer.remarks = reason
        offer.responded_at = datetime.now(timezone.utc)

        await self.token_repo.mark_used(link)
        await self.db.commit()

        return {"message": "Offer rejected"}
