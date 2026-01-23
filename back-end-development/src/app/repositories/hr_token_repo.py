import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.hr_access_link import HRAccessLink


class HRTokenRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================
    # 🔐 Create HR access token
    # =====================================================
    async def create_token(self, candidate_id) -> HRAccessLink:
        token = secrets.token_urlsafe(32)

        link = HRAccessLink(
            candidate_id=candidate_id,
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(days=3),
            is_used=False,
        )

        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)

        return link

    # =====================================================
    # 🔎 Get token record
    # =====================================================
    async def get_by_token(self, token: str) -> HRAccessLink | None:
        result = await self.db.execute(
            select(HRAccessLink).where(HRAccessLink.token == token)
        )
        return result.scalar_one_or_none()

    # =====================================================
    # ✅ Mark token as used
    # =====================================================
    async def mark_used(self, link: HRAccessLink):
        link.is_used = True
        await self.db.commit()
