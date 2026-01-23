import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.candidate_offer_link import CandidateOfferLink


class CandidateOfferTokenRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, candidate_id, offer_id):
        token = secrets.token_urlsafe(48)

        link = CandidateOfferLink(
            candidate_id=candidate_id,
            offer_id=offer_id,
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
        )

        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)

        return link

    async def get_valid(self, token: str):
        result = await self.db.execute(
            select(CandidateOfferLink).where(
                CandidateOfferLink.token == token,
                CandidateOfferLink.is_used == False,
            )
        )
        link = result.scalar_one_or_none()

        if not link:
            return None

        if link.expires_at and link.expires_at < datetime.now(timezone.utc):
            return None

        return link

    async def mark_used(self, link: CandidateOfferLink):
        link.is_used = True
        await self.db.commit()
