import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.hr_access_link import HRAccessLink


class HRTokenRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================
    #  Create or reuse HR access token (NON-EXPIRING)
    # =====================================================
    async def create_token(self, candidate_id) -> HRAccessLink:
        """
        Creates a persistent HR access link.
        If a link already exists for the candidate, reuse it.
        """

        result = await self.db.execute(
            select(HRAccessLink).where(
                HRAccessLink.candidate_id == candidate_id,
                HRAccessLink.is_used == False,
            )
        )
        existing_link = result.scalar_one_or_none()

        if existing_link:
            return existing_link

        token = secrets.token_urlsafe(32)

        link = HRAccessLink(
            candidate_id=candidate_id,
            token=token,
            is_used=False,
        )

        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)

        return link

    # =====================================================
    # 🔎 Get token record (NON-EXPIRING)
    # =====================================================
    async def get_by_token(self, token: str) -> HRAccessLink | None:
        result = await self.db.execute(
            select(HRAccessLink).where(
                HRAccessLink.token == token,
                HRAccessLink.is_used == False,
            )
        )
        return result.scalar_one_or_none()

    # =====================================================
    # Disable HR link (after decision)
    # =====================================================
    async def disable(self, link: HRAccessLink):
        link.is_used = True
        await self.db.commit()