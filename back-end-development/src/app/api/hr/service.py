# # src/app/api/hr/service.py

# from datetime import datetime, timezone
# from typing import Optional, Tuple, List
# from uuid import UUID
# import uuid

# from fastapi import HTTPException, status
# from sqlalchemy import select, func, or_
# from sqlalchemy.ext.asyncio import AsyncSession

# from datetime import timedelta

# from src.app.repositories.hr_token_repo import HRTokenRepository
# from src.app.models.candidate import Candidate
# from src.app.models.interview import Interview
# from src.app.models.offer import Offer
# from src.app.models.hr_access_link import HRAccessLink


# class HRService:
#     def __init__(self, db: AsyncSession):
#         self.db = db
#         self.hr_token_repo = HRTokenRepository(db)

#     # =====================================================
#     # 🔐 TOKEN VALIDATION + AUDIT TRAIL
#     # =====================================================
#     async def validate_access_token(self, token: str):
#         link = await self.hr_token_repo.get_by_token(token)

#         if not link:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Invalid HR access link",
#             )

#         now = datetime.now(timezone.utc)

#         expires_at = link.expires_at
#         if expires_at.tzinfo is None:
#             expires_at = expires_at.replace(tzinfo=timezone.utc)

#         if expires_at < now:
#             raise HTTPException(
#                 status_code=status.HTTP_410_GONE,
#                 detail="HR access link expired",
#             )

#         if link.is_used:
#             raise HTTPException(
#                 status_code=status.HTTP_409_CONFLICT,
#                 detail="HR access link already used",
#             )

#         # ✅ AUDIT TRAIL
#         link.opened_at = now
#         link.opened_by = "HR"
#         link.open_count = (link.open_count or 0) + 1

#         await self.db.commit()

#         return link

#     # =====================================================
#     # 👤 HR CANDIDATE DETAIL (TOKEN-BASED)
#     # =====================================================
#     async def get_candidate_detail(
#         self,
#         *,
#         token: str,
#         candidate_id: UUID,
#     ):
#         link = await self.validate_access_token(token)

#         if link.candidate_id != candidate_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="HR access not permitted for this candidate",
#             )

#         candidate = await self.db.get(Candidate, candidate_id)
#         if not candidate or not candidate.is_active:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Candidate not found",
#             )

#         interviews = (
#             await self.db.execute(
#                 select(Interview)
#                 .where(Interview.candidate_id == candidate_id)
#                 .order_by(Interview.round_number)
#             )
#         ).scalars().all()

#         offer = (
#             await self.db.execute(
#                 select(Offer)
#                 .where(
#                     Offer.candidate_id == candidate_id,
#                     Offer.is_active == True,
#                 )
#             )
#         ).scalar_one_or_none()

#         return candidate, interviews, offer

#     # =====================================================
#     # 🎯 HR DECISION (APPROVE / HOLD / REJECT)
#     # =====================================================
#     async def hr_decision(
#         self,
#         *,
#         token: str,
#         candidate_id: UUID,
#         decision: str,
#         remarks: Optional[str] = None,
#     ):
#         link = await self.validate_access_token(token)

#         if link.candidate_id != candidate_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="HR access not permitted for this candidate",
#             )

#         candidate = await self.db.get(Candidate, candidate_id)
#         if not candidate:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Candidate not found",
#             )

#         decision = decision.upper()

#         if decision == "APPROVE":
#             candidate.status = "OFFER_APPROVED"

#         elif decision == "HOLD":
#             candidate.status = "HR_HOLD"

#         elif decision == "REJECT":
#             candidate.status = "HR_REJECTED"

#         else:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid HR decision",
#             )

#         candidate.hr_decision = decision
#         candidate.hr_decision_remarks = remarks
#         candidate.hr_decision_at = datetime.now(timezone.utc)

#         link.is_used = True

#         await self.db.commit()
#         await self.db.refresh(candidate)

#         return candidate

#     # =====================================================
#     # 📊 HR DASHBOARD — CANDIDATE LIST
#     # =====================================================
#     async def dashboard_candidates(
#         self,
#         *,
#         page: int = 1,
#         page_size: int = 20,
#         search: Optional[str] = None,
#         status: Optional[str] = None,
#     ) -> Tuple[List[dict], int]:

#         latest_interview_subq = (
#             select(
#                 Interview.candidate_id.label("candidate_id"),
#                 func.max(Interview.scheduled_at).label("latest_scheduled_at"),
#             )
#             .group_by(Interview.candidate_id)
#             .subquery()
#         )

#         latest_interview_join = (
#             select(Interview)
#             .join(
#                 latest_interview_subq,
#                 (Interview.candidate_id == latest_interview_subq.c.candidate_id)
#                 & (
#                     Interview.scheduled_at
#                     == latest_interview_subq.c.latest_scheduled_at
#                 ),
#             )
#             .subquery()
#         )

#         q = (
#             select(
#                 Candidate,
#                 latest_interview_join.c.round_name.label("latest_round"),
#                 latest_interview_join.c.status.label("latest_interview_status"),
#                 Offer.status.label("offer_status"),
#             )
#             .outerjoin(
#                 latest_interview_join,
#                 latest_interview_join.c.candidate_id == Candidate.id,
#             )
#             .outerjoin(Offer, Offer.candidate_id == Candidate.id)
#             .order_by(Candidate.created_at.desc())
#         )

#         if status:
#             q = q.where(Candidate.status == status)

#         if search:
#             s = f"%{search.strip()}%"
#             q = q.where(
#                 or_(
#                     Candidate.first_name.ilike(s),
#                     Candidate.last_name.ilike(s),
#                     Candidate.email.ilike(s),
#                     Candidate.phone.ilike(s),
#                     Candidate.role.ilike(s),
#                 )
#             )

#         total = (
#             await self.db.execute(
#                 select(func.count()).select_from(q.subquery())
#             )
#         ).scalar_one()

#         rows = (
#             await self.db.execute(
#                 q.offset((page - 1) * page_size).limit(page_size)
#             )
#         ).all()

#         items = []
#         for cand, latest_round, latest_interview_status, offer_status in rows:
#             items.append(
#                 dict(
#                     id=cand.id,
#                     full_name=f"{cand.first_name} {cand.last_name}",
#                     email=cand.email,
#                     phone=cand.phone,
#                     role=cand.role,
#                     experience_type=cand.experience_type,
#                     status=cand.status,
#                     latest_round=latest_round,
#                     latest_interview_status=latest_interview_status,
#                     offer_status=offer_status,
#                     created_at=cand.created_at,
#                 )
#             )

#         return items, total

#     # =====================================================
#     # 📁 HR AUDIT EXPORT DATA
#     # =====================================================
#     async def get_hr_audit_rows(self) -> List[dict]:
#         result = await self.db.execute(
#             select(
#                 Candidate.first_name,
#                 Candidate.last_name,
#                 Candidate.email,
#                 Candidate.status,
#                 func.coalesce(func.max(func.now()), None).label("last_opened_at"),
#                 func.count().label("open_count"),
#             )
#             .group_by(
#                 Candidate.first_name,
#                 Candidate.last_name,
#                 Candidate.email,
#                 Candidate.status,
#             )
#         )

#         rows = []
#         for r in result.all():
#             rows.append(
#                 {
#                     "full_name": f"{r.first_name} {r.last_name}",
#                     "email": r.email,
#                     "status": r.status,
#                     "opened_by": "HR",
#                     "opened_at": None,
#                     "last_opened_at": r.last_opened_at,
#                     "open_count": r.open_count,
#                 }
#             )

#         return rows


#     async def generate_access_link(self, candidate_id: UUID) -> str:
#     # 1️⃣ Validate candidate
#         candidate = await self.db.get(Candidate, candidate_id)
#         if not candidate:
#             raise HTTPException(status_code=404, detail="Candidate not found")

#         # 2️⃣ Generate token
#         token = uuid.uuid4().hex
#         expires_at = datetime.now(timezone.utc) + timedelta(days=3)

#         # 3️⃣ Store token
#         hr_link = HRAccessLink(
#             token=token,
#             candidate_id=candidate_id,
#             expires_at=expires_at,
#             created_at=datetime.now(timezone.utc),
#         )

#         self.db.add(hr_link)
#         await self.db.commit()

#         # 4️⃣ Return frontend URL
#         return f"http://localhost:3000/hr/candidates/{candidate_id}?token={token}"
    




from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, List
from uuid import UUID
import uuid
import secrets

from fastapi import HTTPException, status
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.repositories.hr_token_repo import HRTokenRepository
from src.app.models.candidate import Candidate
from src.app.models.interview import Interview
from src.app.models.offer import Offer
from src.app.models.hr_access_link import HRAccessLink


class HRService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.hr_token_repo = HRTokenRepository(db)

    # =====================================================
    # 🔐 TOKEN VALIDATION + AUDIT TRAIL
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
        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at and expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="HR access link expired",
            )

        if link.is_used:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="HR access link already used",
            )

        # ✅ AUDIT TRAIL
        link.opened_at = now
        link.opened_by = "HR"
        link.open_count = (link.open_count or 0) + 1

        await self.db.commit()

        return link

    # =====================================================
    # 👤 HR CANDIDATE DETAIL (TOKEN-BASED)
    # =====================================================
    async def get_candidate_detail(
        self,
        *,
        token: str,
        candidate_id: UUID,
    ):
        link = await self.validate_access_token(token)

        if link.candidate_id != candidate_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="HR access not permitted for this candidate",
            )

        candidate = await self.db.get(Candidate, candidate_id)
        if not candidate or not candidate.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        interviews = (
            await self.db.execute(
                select(Interview)
                .where(Interview.candidate_id == candidate_id)
                .order_by(Interview.round_number)
            )
        ).scalars().all()

        offer = (
            await self.db.execute(
                select(Offer)
                .where(
                    Offer.candidate_id == candidate_id,
                    Offer.is_active == True,
                )
            )
        ).scalar_one_or_none()

        return candidate, interviews, offer

    # =====================================================
    # 🎯 HR DECISION (APPROVE / HOLD / REJECT)
    # =====================================================
    async def hr_decision(
        self,
        *,
        token: str,
        candidate_id: UUID,
        decision: str,
        remarks: Optional[str] = None,
    ):
        link = await self.validate_access_token(token)

        if link.candidate_id != candidate_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="HR access not permitted for this candidate",
            )

        candidate = await self.db.get(Candidate, candidate_id)
        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        decision = decision.upper()

        if decision == "APPROVE":
            candidate.status = "OFFER_APPROVED"
        elif decision == "HOLD":
            candidate.status = "HR_HOLD"
        elif decision == "REJECT":
            candidate.status = "HR_REJECTED"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid HR decision",
            )

        candidate.hr_decision = decision
        candidate.hr_decision_remarks = remarks
        candidate.hr_decision_at = datetime.now(timezone.utc)

        link.is_used = True

        await self.db.commit()
        await self.db.refresh(candidate)

        return candidate

    # =====================================================
    # 📊 HR DASHBOARD — CANDIDATE LIST
    # =====================================================
    async def dashboard_candidates(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Tuple[List[dict], int]:

        latest_interview_subq = (
            select(
                Interview.candidate_id.label("candidate_id"),
                func.max(Interview.scheduled_at).label("latest_scheduled_at"),
            )
            .group_by(Interview.candidate_id)
            .subquery()
        )

        latest_interview_join = (
            select(Interview)
            .join(
                latest_interview_subq,
                (Interview.candidate_id == latest_interview_subq.c.candidate_id)
                & (
                    Interview.scheduled_at
                    == latest_interview_subq.c.latest_scheduled_at
                ),
            )
            .subquery()
        )

        q = (
            select(
                Candidate,
                latest_interview_join.c.round_name.label("latest_round"),
                latest_interview_join.c.status.label("latest_interview_status"),
                Offer.status.label("offer_status"),
            )
            .outerjoin(
                latest_interview_join,
                latest_interview_join.c.candidate_id == Candidate.id,
            )
            .outerjoin(Offer, Offer.candidate_id == Candidate.id)
            .order_by(Candidate.created_at.desc())
        )

        if status:
            q = q.where(Candidate.status == status)

        if search:
            s = f"%{search.strip()}%"
            q = q.where(
                or_(
                    Candidate.first_name.ilike(s),
                    Candidate.last_name.ilike(s),
                    Candidate.email.ilike(s),
                    Candidate.phone.ilike(s),
                    Candidate.role.ilike(s),
                )
            )

        total = (
            await self.db.execute(
                select(func.count()).select_from(q.subquery())
            )
        ).scalar_one()

        rows = (
            await self.db.execute(
                q.offset((page - 1) * page_size).limit(page_size)
            )
        ).all()

        items = []
        for cand, latest_round, latest_interview_status, offer_status in rows:
            items.append(
                dict(
                    id=cand.id,
                    full_name=f"{cand.first_name} {cand.last_name}",
                    email=cand.email,
                    phone=cand.phone,
                    role=cand.role,
                    experience_type=cand.experience_type,
                    status=cand.status,
                    latest_round=latest_round,
                    latest_interview_status=latest_interview_status,
                    offer_status=offer_status,
                    created_at=cand.created_at,
                )
            )

        return items, total

    # =====================================================
    # 📁 HR AUDIT EXPORT DATA
    # =====================================================
    async def get_hr_audit_rows(self) -> List[dict]:
        result = await self.db.execute(
            select(
                Candidate.first_name,
                Candidate.last_name,
                Candidate.email,
                Candidate.status,
                func.coalesce(func.max(func.now()), None).label("last_opened_at"),
                func.count().label("open_count"),
            )
            .group_by(
                Candidate.first_name,
                Candidate.last_name,
                Candidate.email,
                Candidate.status,
            )
        )

        rows = []
        for r in result.all():
            rows.append(
                {
                    "full_name": f"{r.first_name} {r.last_name}",
                    "email": r.email,
                    "status": r.status,
                    "opened_by": "HR",
                    "opened_at": None,
                    "last_opened_at": r.last_opened_at,
                    "open_count": r.open_count,
                }
            )

        return rows

    # =====================================================
    # 🔗 GENERATE HR ACCESS LINK (REUSABLE)
    # =====================================================
    async def generate_access_link(self, candidate_id: UUID):
        """
        Generate reusable HR access link (NO expiry, NO one-time-use)
        """

        # 1️⃣ Validate candidate
        candidate = await self.db.get(Candidate, candidate_id)
        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        # 2️⃣ Generate secure token
        token = secrets.token_urlsafe(48)

        # 3️⃣ Create HR access link
        hr_link = HRAccessLink(
            token=token,
            candidate_id=candidate_id,
        )

        # 4️⃣ Save to DB
        self.db.add(hr_link)
        await self.db.commit()
        await self.db.refresh(hr_link)

        # 5️⃣ Return frontend URL
        return {
            "url": f"http://localhost:3000/hr/candidates/{candidate_id}?token={token}"
        }