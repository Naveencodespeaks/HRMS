
# # src/app/routers/candidates.py
# from __future__ import annotations

# from typing import Optional
# from uuid import UUID

# from fastapi import APIRouter, Depends, HTTPException, Query, status
# from sqlalchemy.ext.asyncio import AsyncSession

# from src.app.core.db import get_db
# from src.app.api.candidates.schemas import (
#     CandidateCreate,
#     CandidateUpdate,
#     CandidateResponse,
# )
# from src.app.services.candidate_service import CandidateService

# router = APIRouter(prefix="/candidates", tags=["Candidates"])


# @router.post(
#     "",
#     response_model=CandidateResponse,
#     status_code=status.HTTP_201_CREATED,
# )
# async def create_candidate(
#     payload: CandidateCreate,
#     db: AsyncSession = Depends(get_db),
# ):
#     try:
#         candidate = await CandidateService.create(db, payload)
#         return candidate
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))


# @router.get("", response_model=dict)
# async def list_candidates(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(10, ge=1, le=100),
#     search: Optional[str] = Query(None, min_length=1),
#     db: AsyncSession = Depends(get_db),
# ):
#     items, total = await CandidateService.list(
#         db,
#         page=page,
#         page_size=page_size,
#         search=search,
#     )

#     return {
#         "items": items,
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "pages": (total + page_size - 1) // page_size,
#     }


# @router.get("/{candidate_id}", response_model=CandidateResponse)
# async def get_candidate(
#     candidate_id: UUID,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_by_id(db, candidate_id)
#     if not candidate:
#         raise HTTPException(status_code=404, detail="Candidate not found")
#     return candidate


# @router.patch("/{candidate_id}", response_model=CandidateResponse)
# async def update_candidate(
#     candidate_id: UUID,
#     payload: CandidateUpdate,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_by_id(db, candidate_id)
#     if not candidate:
#         raise HTTPException(status_code=404, detail="Candidate not found")

#     try:
#         updated = await CandidateService.update(db, candidate, payload)
#         return updated
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))


# @router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_candidate(
#     candidate_id: UUID,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_by_id(db, candidate_id)
#     if not candidate:
#         raise HTTPException(status_code=404, detail="Candidate not found")

#     # 🔐 Temporary value (later replace with logged-in user)
#     deleted_by = "admin@mahavirgroup.com"

#     await CandidateService.delete(db, candidate, deleted_by)
#     return None


# @router.post(
#     "/{candidate_id}/restore",
#     response_model=CandidateResponse,
# )
# async def restore_candidate(
#     candidate_id: UUID,
#     db: AsyncSession = Depends(get_db),
# ):
#     # Fetch including deleted candidates
#     candidate = await CandidateService.get_any_by_id(db, candidate_id)

#     if not candidate:
#         raise HTTPException(status_code=404, detail="Candidate not found")

#     if candidate.is_active:
#         raise HTTPException(
#             status_code=400,
#             detail="Candidate is already active",
#         )

#     restored = await CandidateService.restore(db, candidate)
#     return restored




# src/app/api/candidates/router.py
from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.db import get_db
from src.app.api.candidates.schemas import (
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse,
)
from src.app.services.candidate_service import CandidateService

router = APIRouter(prefix="/candidates", tags=["Candidates"])


# =========================
# Create Candidate
# =========================
@router.post(
    "",
    response_model=CandidateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_candidate(
    payload: CandidateCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        candidate = await CandidateService.create(db, payload)
        # ✅ ORM object is safely serialized (Pydantic v2)
        return candidate
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# List Candidates (FIXED)
# =========================
@router.get("", response_model=dict)
async def list_candidates(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, min_length=1),
    db: AsyncSession = Depends(get_db),
):
    items, total = await CandidateService.list(
        db,
        page=page,
        page_size=page_size,
        search=search,
    )

    # ✅ IMPORTANT FIX: Convert ORM → Pydantic
    serialized_items = [
        CandidateResponse.model_validate(item) for item in items
    ]

    return {
        "items": serialized_items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }


# =========================
# Get Candidate by ID
# =========================
@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


# =========================
# Update Candidate
# =========================
@router.patch("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: UUID,
    payload: CandidateUpdate,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    try:
        updated = await CandidateService.update(db, candidate, payload)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# Soft Delete Candidate
# =========================
@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # 🔐 Temporary value (later replace with logged-in user)
    deleted_by = "admin@mahavirgroup.com"

    await CandidateService.delete(db, candidate, deleted_by)
    return None


# =========================
# Restore Candidate
# =========================
@router.post(
    "/{candidate_id}/restore",
    response_model=CandidateResponse,
)
async def restore_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    # Fetch including deleted candidates
    candidate = await CandidateService.get_any_by_id(db, candidate_id)

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if candidate.is_active:
        raise HTTPException(
            status_code=400,
            detail="Candidate is already active",
        )

    restored = await CandidateService.restore(db, candidate)
    return restored
