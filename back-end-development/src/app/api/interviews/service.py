from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import datetime, timezone, timedelta

from src.app.models.interview import Interview
from src.app.models.candidate import Candidate
from src.app.models.job import Job

# Teams + Email helpers
from src.app.utils.email import (
    _get_graph_access_token,
    send_teams_interview_email,
)
from src.app.utils.teams import create_teams_meeting


class InterviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # -------------------------------------------------
    # SCHEDULE INTERVIEW
    # -------------------------------------------------
    async def schedule_interview(self, data):
        # 1️⃣ Validate candidate
        candidate = await self.db.get(Candidate, data.candidate_id)
        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )

        # 2️⃣ Validate job (optional)
        job_id = data.job_id
        if job_id:
            job = await self.db.get(Job, job_id)
            if not job:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid job_id. Job does not exist.",
                )

        # 3️⃣ Create interview (DB first)
        interview = Interview(
            candidate_id=data.candidate_id,
            job_id=job_id,
            round_number=data.round_number,
            round_name=data.round_name,
            interview_type=data.interview_type,
            interviewer_name=data.interviewer_name,
            interviewer_email=data.interviewer_email,
            scheduled_at=data.scheduled_at,
            status="SCHEDULED",
        )

        self.db.add(interview)
        await self.db.flush()  # ensures interview.id exists

        try:
            # 4️⃣ Create Microsoft Teams meeting
            access_token = _get_graph_access_token()

            meeting_link = create_teams_meeting(
                access_token=access_token,
                subject=f"Interview – {candidate.first_name}",
                start_time=data.scheduled_at.isoformat(),
                end_time=(
                    data.scheduled_at + timedelta(minutes=60)
                ).isoformat(),
            )

            interview.meeting_link = meeting_link
            interview.meeting_platform = "MICROSOFT_TEAMS"

            # 5️⃣ Update candidate status
            candidate.status = "INTERVIEW_SCHEDULED"

            await self.db.commit()
            await self.db.refresh(interview)

            # 6️⃣ Send email AFTER successful commit
            send_teams_interview_email(
                to_email=candidate.email,
                candidate_name=candidate.first_name,
                interview_datetime=str(data.scheduled_at),
                meeting_link=meeting_link,
            )

            return interview

        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to schedule interview: {str(e)}",
            )

    # -------------------------------------------------
    # UPDATE INTERVIEW RESULT
    # -------------------------------------------------
    async def update_interview(self, interview_id, data):
        result = await self.db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        interview = result.scalar_one_or_none()

        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found",
            )

        interview.status = data.status
        interview.feedback = data.feedback
        interview.rating = data.rating

        if data.status in ("PASSED", "FAILED"):
            interview.completed_at = datetime.now(timezone.utc)

            candidate = await self.db.get(Candidate, interview.candidate_id)
            if candidate:
                candidate.status = (
                    "INTERVIEW_PASSED"
                    if data.status == "PASSED"
                    else "INTERVIEW_FAILED"
                )

        await self.db.commit()
        return interview

    # -------------------------------------------------
    # GET CANDIDATE INTERVIEWS
    # -------------------------------------------------
    async def get_candidate_interviews(self, candidate_id):
        result = await self.db.execute(
            select(Interview)
            .where(Interview.candidate_id == candidate_id)
            .order_by(Interview.round_number)
        )
        return result.scalars().all()

    # -------------------------------------------------
    # GET INTERVIEW BY ID
    # -------------------------------------------------
    async def get_interview_by_id(self, interview_id):
        result = await self.db.execute(
            select(Interview).where(Interview.id == interview_id)
        )
        interview = result.scalar_one_or_none()

        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found",
            )

        return interview
