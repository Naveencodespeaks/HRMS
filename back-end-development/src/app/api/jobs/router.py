from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.app.core.db import get_db
from src.app.services.job_service import JobService
from src.app.api.jobs.schemas import JobCreate, JobUpdate, JobResponse

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("", response_model=JobResponse, status_code=201)
async def create_job(
    payload: JobCreate,
    db: AsyncSession = Depends(get_db),
):
    service = JobService(db)
    return await service.create_job(payload)


@router.get("", response_model=list[JobResponse])
async def list_jobs(
    status: str | None = Query(None, description="OPEN / CLOSED / ON_HOLD"),
    db: AsyncSession = Depends(get_db),
):
    service = JobService(db)
    return await service.list_jobs(status)


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = JobService(db)
    return await service.get_job(job_id)


@router.patch("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: UUID,
    payload: JobUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = JobService(db)
    return await service.update_job(job_id, payload)


@router.post("/{job_id}/close", response_model=JobResponse)
async def close_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = JobService(db)
    return await service.close_job(job_id)
