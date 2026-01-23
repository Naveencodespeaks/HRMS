# src/app/services/interview_service.py

from uuid import UUID
from datetime import datetime, timezone, timedelta

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.interview import Interview
from src.app.models.candidate import Candidate
from src.app.models.job import Job

# ✅ External helpers
from src.app.utils.email import send_teams_interview_email
from src.app.utils.teams import create_teams_meeting
from src.app.utils.email import _get_graph_access_token


class InterviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================
    # 📅 SCHEDULE INTERVIEW
    # =====================================================
    async def schedule_interview(self, payload) -> Interview:
        """
        Schedules an interview with:
        - Candidate validation
        - Job validation (optional)
        - Microsoft Teams meeting
        - Email notification
        """

        # 1️⃣ Validate candidate
        result = await self.db.execute(
            select(Candidate).where(
                Candidate.id == payload.candidate_id,
                Candidate.is_active.is_(True),
            )
        )
        candidate = result.scalar_one_or_none()

        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found or inactive",
            )

        # 2️⃣ Validate job (optional)
        if payload.job_id:
            job_result = await self.db.execute(
                select(Job).where(
                    Job.id == payload.job_id,
                    Job.status == "OPEN",
                    Job.is_active.is_(True),
                )
            )
            job = job_result.scalar_one_or_none()

            if not job:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or closed job",
                )

        # 3️⃣ Create interview (DB first)
        interview = Interview(
            candidate_id=payload.candidate_id,
            job_id=payload.job_id,
            round_number=payload.round_number,
            round_name=payload.round_name,
            interview_type=payload.interview_type,
            interviewer_name=payload.interviewer_name,
            interviewer_email=payload.interviewer_email,
            scheduled_at=payload.scheduled_at,
            status="SCHEDULED",
        )

        self.db.add(interview)
        await self.db.flush()  # ✅ ensures interview.id exists

        # 4️⃣ Create Microsoft Teams meeting
        access_token = _get_graph_access_token()

        meeting_link = create_teams_meeting(
            access_token=access_token,
            subject=f"Interview – {candidate.first_name}",
            start_time=payload.scheduled_at.isoformat(),
            end_time=(
                payload.scheduled_at + timedelta(minutes=60)
            ).isoformat(),
        )

        interview.meeting_platform = "MICROSOFT_TEAMS"
        interview.meeting_link = meeting_link

        # 5️⃣ Update candidate status
        candidate.status = "INTERVIEW_SCHEDULED"

        await self.db.commit()
        await self.db.refresh(interview)

        # 6️⃣ Send interview email (outside transaction)
        send_teams_interview_email(
            to_email=candidate.email,
            candidate_name=candidate.first_name,
            interview_datetime=payload.scheduled_at.strftime(
                "%d %b %Y, %I:%M %p"
            ),
            meeting_link=meeting_link,
        )

        return interview

    # =====================================================
    # ✏️ UPDATE INTERVIEW RESULT
    # =====================================================
    async def update_interview(self, interview_id: UUID, payload) -> Interview:
        result = await self.db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        interview = result.scalar_one_or_none()

        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found",
            )

        interview.status = payload.status
        interview.feedback = payload.feedback
        interview.rating = payload.rating

        if payload.status in {"PASSED", "FAILED"}:
            interview.completed_at = datetime.now(timezone.utc)

            candidate = await self.db.get(Candidate, interview.candidate_id)
            if candidate:
                candidate.status = (
                    "INTERVIEW_PASSED"
                    if payload.status == "PASSED"
                    else "INTERVIEW_FAILED"
                )

        await self.db.commit()
        await self.db.refresh(interview)

        return interview

    # =====================================================
    # 📄 GET INTERVIEWS BY CANDIDATE
    # =====================================================
    async def get_candidate_interviews(self, candidate_id: UUID):
        result = await self.db.execute(
            select(Interview)
            .where(Interview.candidate_id == candidate_id)
            .order_by(Interview.round_number)
        )
        return result.scalars().all()

    # =====================================================
    # 🔍 GET INTERVIEW BY ID
    # =====================================================
    async def get_interview_by_id(self, interview_id: UUID):
        result = await self.db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        return result.scalar_one_or_none()
