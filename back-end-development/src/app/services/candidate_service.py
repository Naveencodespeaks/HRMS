# src/app/services/candidate_service.py

from typing import Optional, List, Tuple
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy import select, or_, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import UploadFile

from src.app.models.candidate import Candidate
from src.app.api.candidates.schemas import CandidateCreate, CandidateUpdate
from src.app.utils.sharepoint_resume_storage import (
    upload_resume_to_sharepoint,
    get_secure_resume_download_url,
    delete_resume_from_sharepoint,
)

class CandidateService:

    # -----------------------------
    # CREATE WITH RESUME (ONLY ENTRY POINT)
    # -----------------------------
    @staticmethod
    async def create_with_resume(
        *,
        db: AsyncSession,
        payload: CandidateCreate,
        resume: UploadFile,
    ) -> Candidate:
        """
        Create candidate with mandatory resume.
        Resume is uploaded to SharePoint and URL is stored in DB.
        """

        resume_url = None

        try:
            # -----------------------------
            # 1️⃣ Upload resume FIRST
            # -----------------------------
            resume_bytes = await resume.read()

            resume_url = upload_resume_to_sharepoint(
                candidate_id="temp",  # temp placeholder
                filename=resume.filename,
                file_bytes=resume_bytes,
                content_type=resume.content_type or "application/octet-stream",
            )

            # -----------------------------
            # 2️⃣ Create candidate WITH resume_url
            # -----------------------------
            candidate = Candidate(
                first_name=payload.first_name,
                last_name=payload.last_name,
                phone=payload.phone,
                email=payload.email,
                address=payload.address,
                highest_qualification=payload.highest_qualification,
                experience_type=payload.experience_type,
                previous_company=payload.previous_company,
                role=payload.role,
                company_location=payload.company_location,
                total_experience_years=payload.total_experience_years,
                current_ctc=payload.current_ctc,
                expected_ctc=payload.expected_ctc,
                notice_period_days=payload.notice_period_days,
                immediate_joining=bool(payload.immediate_joining),
                date_of_joining=payload.date_of_joining,
                resume_url=resume_url,
            )

            db.add(candidate)

            # -----------------------------
            # 3️⃣ Commit DB (FINAL)
            # -----------------------------
            await db.commit()
            await db.refresh(candidate)

            return candidate

        except IntegrityError:
            await db.rollback()
            if resume_url:
                try:
                    delete_resume_from_sharepoint(resume_url)
                except Exception:
                    pass
            raise ValueError("Candidate with this email already exists")

        except Exception as exc:
            await db.rollback()
            if resume_url:
                try:
                    delete_resume_from_sharepoint(resume_url)
                except Exception:
                    pass
            raise exc

    # -----------------------------
    # GET ACTIVE BY ID
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
    # GET ANY (INCLUDING DELETED)
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
    # LIST (PAGINATION)
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
            .order_by(Candidate.created_at.desc(), Candidate.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        items = (await db.execute(stmt)).scalars().all()
        return items, total

    # -----------------------------
    # UPDATE
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
    # SOFT DELETE
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
    # RESTORE
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

    # -----------------------------
    # RESUME DOWNLOAD URL
    # -----------------------------
    @staticmethod
    async def get_resume_download_url(
        db: AsyncSession,
        candidate_id,
    ) -> str:
        candidate = await CandidateService.get_by_id(db, candidate_id)

        if not candidate:
            raise ValueError("Candidate not found")

        if not candidate.resume_url:
            raise ValueError("Resume not uploaded")

        return get_secure_resume_download_url(candidate.resume_url)
