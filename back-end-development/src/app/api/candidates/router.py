# from __future__ import annotations

# from typing import Optional
# from uuid import UUID
# from datetime import date

# from fastapi import (
#     APIRouter,
#     Depends,
#     HTTPException,
#     Query,
#     status,
#     BackgroundTasks,
#     UploadFile,
#     File,
#     Form,
# )
# from sqlalchemy.ext.asyncio import AsyncSession

# from src.app.core.db import get_db
# from src.app.api.candidates.schemas import (
#     CandidateCreate,
#     CandidateUpdate,
#     CandidateResponse,
# )
# from src.app.services.candidate_service import CandidateService
# from src.app.services.notification_service import NotificationService
# from src.app.utils.email import send_candidate_confirmation_email

# router = APIRouter(prefix="/candidates", tags=["Candidates"])


# # =====================================================
# # CREATE CANDIDATE (WITH RESUME UPLOAD)
# # =====================================================
# @router.post(
#     "",
#     response_model=CandidateResponse,
#     status_code=status.HTTP_201_CREATED,
# )
# async def create_candidate(
#     #  NON-DEFAULT PARAMS FIRST (Python rule)
#     background_tasks: BackgroundTasks,
#     db: AsyncSession = Depends(get_db),

#     #  Resume file
#     resume: UploadFile = File(...),

#     #  Candidate form fields
#     first_name: str = Form(...),
#     last_name: str = Form(...),
#     phone: str = Form(...),
#     email: str = Form(...),
#     address: Optional[str] = Form(None),

#     highest_qualification: str = Form(...),
#     experience_type: str = Form(...),  # fresher | experienced

#     previous_company: Optional[str] = Form(None),
#     role: Optional[str] = Form(None),
#     company_location: Optional[str] = Form(None),

#     total_experience_years: Optional[int] = Form(None),
#     current_ctc: Optional[int] = Form(None),
#     expected_ctc: int = Form(...),

#     notice_period_days: Optional[int] = Form(None),
#     immediate_joining: bool = Form(False),
#     date_of_joining: Optional[date] = Form(None),
# ):
#     try:
#         # 1 Validate input using Pydantic
#         payload = CandidateCreate(
#             first_name=first_name,
#             last_name=last_name,
#             phone=phone,
#             email=email,
#             address=address,
#             highest_qualification=highest_qualification,
#             experience_type=experience_type,
#             previous_company=previous_company,
#             role=role,
#             company_location=company_location,
#             total_experience_years=total_experience_years,
#             current_ctc=current_ctc,
#             expected_ctc=expected_ctc,
#             notice_period_days=notice_period_days,
#             immediate_joining=immediate_joining,
#             date_of_joining=date_of_joining,
#         )

#         # 2 Create candidate
#         candidate = await CandidateService.create(db, payload)

#         # 3 Upload resume to SharePoint
#         await CandidateService.upload_resume(
#             db=db,
#             candidate=candidate,
#             resume=resume,
#         )

#         # 4 Recruiter notification (non-blocking)
#         try:
#             await NotificationService.create_candidate_notification(
#                 db=db,
#                 candidate_id=candidate.id,
#                 candidate_name=f"{candidate.first_name} {candidate.last_name}",
#             )
#         except Exception as e:
#             print("Notification error:", repr(e))

#         # 5 Confirmation email
#         background_tasks.add_task(
#             send_candidate_confirmation_email,
#             candidate.email,
#             candidate.first_name,
#         )

#         return candidate

#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))

#     except Exception as e:
#         print("Create candidate error:", repr(e))
#         raise HTTPException(
#             status_code=500,
#             detail="Failed to create candidate",
#         )


# # =====================================================
# # LIST CANDIDATES
# # =====================================================
# @router.get("", response_model=dict)
# async def list_candidates(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(10, ge=1, le=100),
#     search: Optional[str] = Query(None),
#     db: AsyncSession = Depends(get_db),
# ):
#     items, total = await CandidateService.list(
#         db,
#         page=page,
#         page_size=page_size,
#         search=search,
#     )

#     return {
#         "items": [CandidateResponse.model_validate(i) for i in items],
#         "total": total,
#         "page": page,
#         "page_size": page_size,
#         "pages": (total + page_size - 1) // page_size,
#     }


# # =====================================================
# # GET CANDIDATE BY ID
# # =====================================================
# @router.get("/{candidate_id}", response_model=CandidateResponse)
# async def get_candidate(
#     candidate_id: UUID,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_by_id(db, candidate_id)

#     if not candidate:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Candidate not found",
#         )

#     return candidate


# # =====================================================
# # UPDATE CANDIDATE
# # =====================================================
# @router.patch("/{candidate_id}", response_model=CandidateResponse)
# async def update_candidate(
#     candidate_id: UUID,
#     payload: CandidateUpdate,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_by_id(db, candidate_id)

#     if not candidate:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Candidate not found",
#         )

#     return await CandidateService.update(db, candidate, payload)




# # =====================================================
# # SOFT DELETE CANDIDATE
# # =====================================================
# @router.delete( 
#     "/{candidate_id}",
#     status_code=status.HTTP_204_NO_CONTENT,
# )
# async def delete_candidate(
#     candidate_id: UUID,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_by_id(db, candidate_id)

#     if not candidate:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Candidate not found",
#         )

#     # 🔐 temporary (later replace with logged-in user)
#     deleted_by = "hr@mahavirgroup.com"

#     await CandidateService.delete(
#         db=db,
#         candidate=candidate,
#         deleted_by=deleted_by,
#     )

#     return None




# # =====================================================
# # RESTORE CANDIDATE
# # =====================================================
# @router.post(
#     "/{candidate_id}/restore",
#     response_model=CandidateResponse,
# )
# async def restore_candidate(
#     candidate_id: UUID,
#     db: AsyncSession = Depends(get_db),
# ):
#     candidate = await CandidateService.get_any_by_id(db, candidate_id)

#     if not candidate:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Candidate not found",
#         )

#     if candidate.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Candidate is already active",
#         )

#     restored = await CandidateService.restore(db, candidate)
#     return restored






from __future__ import annotations

from typing import Optional
from uuid import UUID
from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
    BackgroundTasks,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.db import get_db
from src.app.api.candidates.schemas import (
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse,
)
from src.app.services.candidate_service import CandidateService
from src.app.services.notification_service import NotificationService
from src.app.utils.email import send_candidate_confirmation_email

router = APIRouter(prefix="/candidates", tags=["Candidates"])


# =====================================================
# CREATE CANDIDATE (WITH RESUME UPLOAD) ✅ FIXED
# =====================================================
@router.post(
    "",
    response_model=CandidateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_candidate(
    # NON-DEFAULT PARAMS FIRST
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),

    # Resume file (MANDATORY)
    resume: UploadFile = File(...),

    # Candidate form fields
    first_name: str = Form(...),
    last_name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    address: Optional[str] = Form(None),

    highest_qualification: str = Form(...),
    experience_type: str = Form(...),  # fresher | experienced

    previous_company: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    company_location: Optional[str] = Form(None),

    total_experience_years: Optional[int] = Form(None),
    current_ctc: Optional[int] = Form(None),
    expected_ctc: int = Form(...),

    notice_period_days: Optional[int] = Form(None),
    immediate_joining: bool = Form(False),
    date_of_joining: Optional[date] = Form(None),
):
    try:
        # 1️⃣ Validate input using Pydantic (UNCHANGED)
        payload = CandidateCreate(
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            email=email,
            address=address,
            highest_qualification=highest_qualification,
            experience_type=experience_type,
            previous_company=previous_company,
            role=role,
            company_location=company_location,
            total_experience_years=total_experience_years,
            current_ctc=current_ctc,
            expected_ctc=expected_ctc,
            notice_period_days=notice_period_days,
            immediate_joining=immediate_joining,
            date_of_joining=date_of_joining,
        )

        # 2️⃣ CREATE CANDIDATE + UPLOAD RESUME (✅ SINGLE CALL)
        candidate = await CandidateService.create_with_resume(
            db=db,
            payload=payload,
            resume=resume,
        )

        # 3️⃣ Recruiter notification (non-blocking)
        try:
            await NotificationService.create_candidate_notification(
                db=db,
                candidate_id=candidate.id,
                candidate_name=f"{candidate.first_name} {candidate.last_name}",
            )
        except Exception as e:
            print("Notification error:", repr(e))

        # 4️⃣ Confirmation email (background)
        background_tasks.add_task(
            send_candidate_confirmation_email,
            candidate.email,
            candidate.first_name,
        )

        return candidate

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print("Create candidate error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to create candidate",
        )


# =====================================================
# LIST CANDIDATES
# =====================================================
@router.get("", response_model=dict)
async def list_candidates(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    items, total = await CandidateService.list(
        db,
        page=page,
        page_size=page_size,
        search=search,
    )

    return {
        "items": [CandidateResponse.model_validate(i) for i in items],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }


# =====================================================
# GET CANDIDATE BY ID
# =====================================================
@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_by_id(db, candidate_id)

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    return candidate


# =====================================================
# UPDATE CANDIDATE
# =====================================================
@router.patch("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: UUID,
    payload: CandidateUpdate,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_by_id(db, candidate_id)

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    return await CandidateService.update(db, candidate, payload)


# =====================================================
# SOFT DELETE CANDIDATE
# =====================================================
@router.delete(
    "/{candidate_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_by_id(db, candidate_id)

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    deleted_by = "hr@mahavirgroup.com"

    await CandidateService.delete(
        db=db,
        candidate=candidate,
        deleted_by=deleted_by,
    )

    return None


# =====================================================
# RESTORE CANDIDATE
# =====================================================
@router.post(
    "/{candidate_id}/restore",
    response_model=CandidateResponse,
)
async def restore_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    candidate = await CandidateService.get_any_by_id(db, candidate_id)

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    if candidate.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate is already active",
        )

    restored = await CandidateService.restore(db, candidate)
    return restored
