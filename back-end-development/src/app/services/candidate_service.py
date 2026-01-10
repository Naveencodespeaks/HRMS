# src/app/services/candidate_service.py

from typing import Optional, List, Tuple
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy import select, or_, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.models.candidate import Candidate
from src.app.api.candidates.schemas import CandidateCreate, CandidateUpdate


class CandidateService:

    # -----------------------------
    # CREATE
    # -----------------------------
    @staticmethod
    async def create(
        db: AsyncSession,
        payload: CandidateCreate,
    ) -> Candidate:
        candidate = Candidate(**payload.model_dump())
        db.add(candidate)

        try:
            await db.commit()
        except IntegrityError:
            await db.rollback()
            raise ValueError("Candidate with this email already exists")

        await db.refresh(candidate)
        return candidate

    # -----------------------------
    # GET ACTIVE BY ID (SOFT DELETE SAFE)
    # -----------------------------
    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        candidate_id: UUID,
    ) -> Optional[Candidate]:
        stmt = select(Candidate).where(
            Candidate.id == candidate_id,
            Candidate.is_active == True,
        )
        result = await db.execute(stmt)
        return result.scalars().first()

    # -----------------------------
    # GET ANY (INCLUDING DELETED) – FOR RESTORE / ADMIN
    # -----------------------------
    @staticmethod
    async def get_any_by_id(
        db: AsyncSession,
        candidate_id: UUID,
    ) -> Optional[Candidate]:
        stmt = select(Candidate).where(Candidate.id == candidate_id)
        result = await db.execute(stmt)
        return result.scalars().first()

    # -----------------------------
    # LIST (ONLY ACTIVE + PAGINATION)
    # -----------------------------
    @staticmethod
    async def list(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
    ) -> Tuple[List[Candidate], int]:

        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        stmt = select(Candidate).where(Candidate.is_active == True)

        if search:
            s = f"%{search.strip()}%"
            stmt = stmt.where(
                or_(
                    Candidate.first_name.ilike(s),
                    Candidate.last_name.ilike(s),
                    Candidate.email.ilike(s),
                    Candidate.phone.ilike(s),
                )
            )

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await db.execute(count_stmt)).scalar_one()

        stmt = (
            stmt
            .order_by(
                Candidate.created_at.desc(),
                Candidate.id.desc(),
            )
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        items = (await db.execute(stmt)).scalars().all()
        return items, total

    # -----------------------------
    # UPDATE (ONLY ACTIVE)
    # -----------------------------
    @staticmethod
    async def update(
        db: AsyncSession,
        candidate: Candidate,
        payload: CandidateUpdate,
    ) -> Candidate:

        if not candidate.is_active:
            raise ValueError("Cannot update a deleted candidate")

        data = payload.model_dump(exclude_unset=True)

        for key, value in data.items():
            setattr(candidate, key, value)

        try:
            await db.commit()
        except IntegrityError:
            await db.rollback()
            raise ValueError("Update failed (email may already exist)")

        await db.refresh(candidate)
        return candidate

    # -----------------------------
    # SOFT DELETE (AUDIT-AWARE)
    # -----------------------------
    @staticmethod
    async def delete(
        db: AsyncSession,
        candidate: Candidate,
        deleted_by: str,
    ) -> None:
        candidate.is_active = False
        candidate.deleted_at = datetime.now(timezone.utc)
        candidate.deleted_by = deleted_by
        await db.commit()

    # -----------------------------
    # RESTORE DELETED CANDIDATE
    # -----------------------------
    @staticmethod
    async def restore(
        db: AsyncSession,
        candidate: Candidate,
    ) -> Candidate:
        candidate.is_active = True
        candidate.deleted_at = None
        candidate.deleted_by = None

        await db.commit()
        await db.refresh(candidate)
        return candidate
