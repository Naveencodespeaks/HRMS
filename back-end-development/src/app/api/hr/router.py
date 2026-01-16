# src/app/api/hr/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.db import get_db
from src.app.services.hr_service import HRAccessService
from src.app.models.candidate import Candidate

router = APIRouter(prefix="/hr", tags=["HR"])



@router.post("/send-access-link")
async def send_hr_access_link(
    candidate_id: str,
    hr_email: str,
    db: AsyncSession = Depends(get_db),
):
    candidate = await db.get(Candidate, candidate_id)

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    token = await HRAccessService.create_hr_access_link(
        db=db,
        candidate=candidate,
        hr_email=hr_email,
    )

    return {
        "message": "HR access link sent successfully",
        "token": token,
    }
