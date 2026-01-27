from uuid import UUID
import csv
import io

from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors

from src.app.core.db import get_db
from src.app.api.hr.service import HRService
from src.app.api.hr.schemas import (
    HRCandidateDetail,
    HRDashboardResponse,
    HRDashboardCandidateItem,
    HRDecisionRequest,
    HRDecisionResponse,
)

router = APIRouter(prefix="/hr", tags=["HR"])

# =========================================================
# 1️⃣ HR DASHBOARD — LIST VIEW
# =========================================================
@router.get("/candidates", response_model=HRDashboardResponse)
async def hr_candidates_dashboard(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    service = HRService(db)

    items, total = await service.dashboard_candidates(
        page=page,
        page_size=page_size,
        search=search,
        status=status,
    )

    return HRDashboardResponse(
        items=[HRDashboardCandidateItem(**i) for i in items],
        page=page,
        page_size=page_size,
        total=total,
    )

# =========================================================
# 2️⃣ HR DECISION
# =========================================================
@router.post(
    "/candidates/{candidate_id}/decision",
    response_model=HRDecisionResponse,
    status_code=201,
)
async def hr_decide_candidate(
    candidate_id: UUID,
    token: str = Query(...),
    payload: HRDecisionRequest = ...,
    db: AsyncSession = Depends(get_db),
):
    service = HRService(db)

    candidate = await service.decide_candidate(
        candidate_id=candidate_id,
        token=token,
        decision=payload.decision,
        remarks=payload.remarks,
    )

    return HRDecisionResponse(
        decision=candidate.hr_decision,
        remarks=candidate.hr_decision_remarks,
        decided_at=candidate.hr_decision_at,
    )

# =========================================================
# 3️⃣ HR CANDIDATE DETAIL — SECURE VIEW
# =========================================================
@router.get("/candidates/{candidate_id}", response_model=HRCandidateDetail)
async def hr_candidate_detail(
    candidate_id: UUID,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    service = HRService(db)

    candidate, interviews, offer = await service.get_candidate_detail(
        token=token,
        candidate_id=candidate_id,
    )

    return HRCandidateDetail(
        id=candidate.id,
        full_name=f"{candidate.first_name} {candidate.last_name}",
        email=candidate.email,
        phone=candidate.phone,
        experience_type=candidate.experience_type,
        highest_qualification=candidate.highest_qualification,
        previous_company=candidate.previous_company,
        total_experience_years=candidate.total_experience_years,
        expected_ctc=candidate.expected_ctc,
        notice_period_days=candidate.notice_period_days,
        immediate_joining=candidate.immediate_joining,
        resume_url=candidate.resume_url,
        created_at=candidate.created_at,
        interviews=[
            {
                "round_number": i.round_number,
                "round_name": i.round_name,
                "interview_type": i.interview_type,
                "status": i.status,
                "feedback": i.feedback,
                "rating": i.rating,
                "scheduled_at": i.scheduled_at,
                "completed_at": i.completed_at,
            }
            for i in interviews
        ],
        offer=(
            {
                "offered_ctc": offer.offered_ctc,
                "status": offer.status,
                "joining_date": offer.joining_date,
                "remarks": offer.remarks,
            }
            if offer
            else None
        ),
    )

# =========================================================
# 4️⃣ HR AUDIT EXPORT — CSV / EXCEL / PDF
# =========================================================
@router.get("/audit/export")
async def hr_audit_export(
    format: str = Query(..., pattern="^(csv|excel|pdf)$"),
    db: AsyncSession = Depends(get_db),
):
    service = HRService(db)
    rows = await service.get_hr_audit_rows()

    headers = [
        "Full Name",
        "Email",
        "Status",
        "Opened By",
        "Opened At",
        "Last Opened At",
        "Open Count",
    ]

    # ---------- CSV ----------
    if format == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(headers)

        for r in rows:
            writer.writerow([
                r["full_name"],
                r["email"],
                r["status"],
                r["opened_by"],
                r["opened_at"],
                r["last_opened_at"],
                r["open_count"],
            ])

        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=hr_audit.csv"},
        )

    # ---------- EXCEL ----------
    if format == "excel":
        from openpyxl import Workbook

        buffer = io.BytesIO()
        wb = Workbook()
        ws = wb.active
        ws.title = "HR Audit"
        ws.append(headers)

        for r in rows:
            ws.append([
                r["full_name"],
                r["email"],
                r["status"],
                r["opened_by"],
                r["opened_at"],
                r["last_opened_at"],
                r["open_count"],
            ])

        wb.save(buffer)
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=hr_audit.xlsx"},
        )

    # ---------- PDF ----------
    if format == "pdf":
        buffer = io.BytesIO()

        doc = SimpleDocTemplate(buffer, pagesize=A4)
        table_data = [headers]

        for r in rows:
            table_data.append([
                r["full_name"],
                r["email"],
                r["status"],
                r["opened_by"],
                str(r["opened_at"]),
                str(r["last_opened_at"]),
                str(r["open_count"]),
            ])

        table = Table(table_data, repeatRows=1)
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
        ]))

        doc.build([table])
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=hr_audit.pdf"},
        )

    raise HTTPException(status_code=400, detail="Invalid export format")

# =========================================================
# 5️⃣ GENERATE HR SECURE ACCESS LINK (CORS SAFE)
# =========================================================
@router.options("/candidates/{candidate_id}/access-link")
async def options_access_link(candidate_id: UUID):
    return Response(status_code=200)

@router.post("/candidates/{candidate_id}/access-link")
async def generate_hr_access_link(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    service = HRService(db)
    link = await service.generate_access_link(candidate_id)
    return {"url": link}