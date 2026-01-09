from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.db import get_async_db
from .schemas import CandidateCreate, CandidateResponse
from .crud import create_candidate, get_candidate_by_email

router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.post("/", response_model=CandidateResponse)
async def create_candidate_profile(
    payload: CandidateCreate,
    db: AsyncSession = Depends(get_async_db),
):
    existing = await get_candidate_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Candidate already exists")

    return await create_candidate(db, payload)
