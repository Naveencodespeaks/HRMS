from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from src.app.models.job import Job
from src.app.api.jobs.schemas import JobCreate, JobUpdate


class JobService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================
    # ➕ CREATE JOB
    # =====================================================
    async def create_job(self, payload: JobCreate) -> Job:
        job = Job(**payload.model_dump())
        self.db.add(job)
        await self.db.commit()
        await self.db.refresh(job)
        return job

    # =====================================================
    # 📄 LIST JOBS
    # =====================================================
    async def list_jobs(self, status: str | None = None):
        stmt = select(Job).where(Job.is_active == True)

        if status:
            stmt = stmt.where(Job.status == status)

        result = await self.db.execute(stmt.order_by(Job.created_at.desc()))
        return result.scalars().all()

    # =====================================================
    # 🔍 GET JOB BY ID
    # =====================================================
    async def get_job(self, job_id: UUID) -> Job:
        result = await self.db.execute(
            select(Job).where(Job.id == job_id, Job.is_active == True)
        )
        job = result.scalar_one_or_none()

        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )
        return job

    # =====================================================
    # ✏️ UPDATE JOB
    # =====================================================
    async def update_job(self, job_id: UUID, payload: JobUpdate) -> Job:
        job = await self.get_job(job_id)

        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(job, key, value)

        await self.db.commit()
        await self.db.refresh(job)
        return job

    # =====================================================
    # 🔒 CLOSE JOB
    # =====================================================
    async def close_job(self, job_id: UUID) -> Job:
        job = await self.get_job(job_id)
        job.status = "CLOSED"
        await self.db.commit()
        await self.db.refresh(job)
        return job

    # =====================================================
    # 🗑️ DEACTIVATE JOB
    # =====================================================
    async def deactivate_job(self, job_id: UUID):
        job = await self.get_job(job_id)
        job.is_active = False
        await self.db.commit()
