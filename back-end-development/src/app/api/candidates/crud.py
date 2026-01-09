from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.candidate import Candidate
from .schemas import CandidateCreate


async def create_candidate(
    db: AsyncSession, payload: CandidateCreate
):
    candidate = Candidate(**payload.dict())
    db.add(candidate)
    await db.commit()
    await db.refresh(candidate)
    return candidate


async def get_candidate_by_email(
    db: AsyncSession, email: str
):
    result = await db.execute(
        select(Candidate).where(Candidate.email == email)
    )
    return result.scalar_one_or_none()
