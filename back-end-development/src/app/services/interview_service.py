# src/app/services/interview_service.py

from uuid import UUID
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.app.models.interview import Interview
from src.app.models.candidate import Candidate
from src.app.models.job import Job


class InterviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # =====================================================
    # 📅 SCHEDULE INTERVIEW
    # =====================================================
    async def schedule_interview(self, payload) -> Interview:
        """
        Schedules an interview.
        - Candidate must exist
        - Job must exist & be OPEN (if provided)
        """

        # 1️⃣ Validate candidate
        candidate_result = await self.db.execute(
            select(Candidate).where(
                Candidate.id == payload.candidate_id,
                Candidate.is_active == True,
            )
        )
        candidate = candidate_result.scalar_one_or_none()

        if not candidate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found or inactive",
            )

        # 2️⃣ Validate job (if provided)
        if payload.job_id:
            job_result = await self.db.execute(
                select(Job).where(
                    Job.id == payload.job_id,
                    Job.status == "OPEN",
                    Job.is_active == True,
                )
            )
            job = job_result.scalar_one_or_none()

            if not job:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or closed job",
                )

        # 3️⃣ Create interview
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
        await self.db.commit()
        await self.db.refresh(interview)

        return interview
    

    def send_teams_interview_email(
    *,
    to_email: str,
    candidate_name: str,
    interview_datetime: str,
    meeting_link: str,
) -> None:
    access_token = _get_graph_access_token()

    url = GRAPH_SEND_MAIL_URL.format(sender=settings.mail_from)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "message": {
            "subject": "Interview Scheduled – Mahavir Group",
            "body": {
                "contentType": "HTML",
                "content": f"""
                <p>Dear <strong>{candidate_name}</strong>,</p>

                <p>Your interview has been scheduled.</p>

                <p>
                  <b>Date & Time:</b> {interview_datetime}<br/>
                  <b>Platform:</b> Microsoft Teams
                </p>

                <p>
                  👉 <a href="{meeting_link}">
                  Click here to join the interview
                  </a>
                </p>

                <p>
                  <i>No Microsoft account required. You may join via browser.</i>
                </p>

                <br/>

                <p>
                  Best Regards,<br/>
                  <strong>Mahavir Group HR Team</strong>
                </p>
                """,
            },
            "toRecipients": [
                {
                    "emailAddress": {
                        "address": to_email
                    }
                }
            ],
        },
        "saveToSentItems": True,
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()


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
