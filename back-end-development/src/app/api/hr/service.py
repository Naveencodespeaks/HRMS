# src/app/api/hr/service.py

from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.sql import func
from uuid import UUID

from src.app.repositories.hr_token_repo import HRTokenRepository
from src.app.models.candidate import Candidate
from src.app.models.interview import Interview
from src.app.models.offer import Offer


class HRService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.hr_token_repo = HRTokenRepository(db)

    # =====================================================
    # 🔐 TOKEN VALIDATION
    # =====================================================
    async def validate_access_token(self, token: str):
        link = await self.hr_token_repo.get_by_token(token)

        if not link:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid HR access link",
            )

        now = datetime.now(timezone.utc)

        expires_at = link.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="HR access link expired",
            )

        if link.is_used:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="HR access link already used",
            )

        return link

    # =====================================================
    # 👤 HR CANDIDATE DETAIL
    # =====================================================
    async def get_candidate_detail(
        self,
        token: str,
        candidate_id: UUID,
    ):
        # 1️⃣ Validate token
        link = await self.validate_access_token(token)

        # 2️⃣ Enforce candidate scope
        if link.candidate_id != candidate_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="HR access not permitted for this candidate",
            )

        # 3️⃣ Fetch candidate
        result = await self.db.execute(
            select(Candidate).where(
                Candidate.id == candidate_id,
                Candidate.is_active == True,
            )
        )
        candidate = result.scalar_one_or_none()

        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        # 4️⃣ Fetch interviews
        interview_result = await self.db.execute(
            select(Interview)
            .where(Interview.candidate_id == candidate_id)
            .order_by(Interview.round_number)
        )
        interviews = interview_result.scalars().all()

        # 5️⃣ Fetch active offer
        offer_result = await self.db.execute(
            select(Offer)
            .where(
                Offer.candidate_id == candidate_id,
                Offer.is_active == True,
            )
        )
        offer = offer_result.scalar_one_or_none()

        return candidate, interviews, offer

    # =====================================================
    # 🎯 HR DECISION (SHORTLIST / REJECT / APPROVE OFFER)
    # =====================================================
    # async def hr_decision(
    #     self,
    #     token: str,
    #     candidate_id: UUID,
    #     action: str,
    #     remarks: str | None = None,
    # ):
    #     # 1️⃣ Validate token
    #     link = await self.validate_access_token(token)

    #     # 2️⃣ Enforce candidate scope
    #     if link.candidate_id != candidate_id:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="HR access not permitted for this candidate",
    #         )

    #     # 3️⃣ Fetch candidate
    #     result = await self.db.execute(
    #         select(Candidate).where(Candidate.id == candidate_id)
    #     )
    #     candidate = result.scalar_one_or_none()

    #     if not candidate:
    #         raise HTTPException(
    #             status_code=status.HTTP_404_NOT_FOUND,
    #             detail="Candidate not found",
    #         )

    #     # =========================
    #     # 🎯 ACTION HANDLING
    #     # =========================

    #     if action == "SHORTLIST":
    #         candidate.is_active = True

    #     elif action == "REJECT":
    #         candidate.is_active = False
    #         candidate.deleted_at = func.now()
    #         candidate.deleted_by = "HR"

    #         if remarks:
    #             # TEMP storage until hr_remarks column exists
    #             candidate.address = remarks

    #     elif action == "HOLD":
    #         if remarks:
    #             candidate.address = remarks

    #     elif action == "APPROVE_OFFER":
    #         offer_result = await self.db.execute(
    #             select(Offer)
    #             .where(
    #                 Offer.candidate_id == candidate_id,
    #                 Offer.is_active == True,
    #             )
    #         )
    #         offer = offer_result.scalar_one_or_none()

    #         if not offer:
    #             raise HTTPException(
    #                 status_code=status.HTTP_400_BAD_REQUEST,
    #                 detail="No active offer found to approve",
    #             )

    #         offer.status = "HR_APPROVED"

    #         if remarks:
    #             offer.remarks = remarks

    #     else:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail="Invalid HR action",
    #         )

    #     # 4️⃣ Mark token as used
    #     link.is_used = True

    #     await self.db.commit()

    #     return {
    #         "message": "HR decision recorded successfully",
    #         "action": action,
    #     }




async def hr_decision(
    self,
    token: str,
    candidate_id: UUID,
    action: str,
    remarks: str | None = None,
):
    # 1️⃣ Validate token
    link = await self.validate_access_token(token)

    # 2️⃣ Enforce candidate scope
    if link.candidate_id != candidate_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="HR access not permitted for this candidate",
        )

    # 3️⃣ Fetch candidate
    result = await self.db.execute(
        select(Candidate).where(Candidate.id == candidate_id)
    )
    candidate = result.scalar_one_or_none()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    action = action.upper()

    # =========================
    # 🎯 HR ACTION HANDLING
    # =========================

    if action == "SHORTLIST":
        candidate.status = "SHORTLISTED"

    elif action == "REJECT":
        candidate.status = "REJECTED"

    elif action == "HOLD":
        candidate.status = "ON_HOLD"

    elif action == "APPROVE_OFFER":
        offer_result = await self.db.execute(
            select(Offer)
            .where(
                Offer.candidate_id == candidate_id,
                Offer.is_active == True,
            )
        )
        offer = offer_result.scalar_one_or_none()

        if not offer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active offer found to approve",
            )

        candidate.status = "OFFER_CREATED"
        offer.status = "HR_APPROVED"

        if remarks:
            offer.remarks = remarks

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid HR action",
        )

    # 4️⃣ Mark token as used
    link.is_used = True

    await self.db.commit()

    return {
        "message": "HR decision recorded successfully",
        "candidate_id": str(candidate.id),
        "status": candidate.status,
        "action": action,
    }
