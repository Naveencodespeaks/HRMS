# src/app/services/hr_service.py

import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.models.hr_access_link import HRAccessLink
from src.app.models.candidate import Candidate
from src.app.utils.email import send_candidate_confirmation_email as send_email


class HRAccessService:
    @staticmethod
    async def create_hr_access_link(
        db: AsyncSession,
        candidate: Candidate,
        hr_email: str,
    ) -> str:
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=48)

        access_link = HRAccessLink(
            candidate_id=candidate.id,
            token=token,
            expires_at=expires_at,
            used=False,
        )

        db.add(access_link)
        await db.commit()
        await db.refresh(access_link)

        # Send email
        await HRAccessService.send_hr_email(
            hr_email=hr_email,
            candidate=candidate,
            token=token,
        )

        return token

    @staticmethod
    async def send_hr_email(
        hr_email: str,
        candidate: Candidate,
        token: str,
    ):
        link = f"https://mahavirgroup.co/hr-access/{token}"

        html = f"""
        <h3>Candidate Short Profile</h3>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><td><b>Name</b></td><td>{candidate.first_name} {candidate.last_name}</td></tr>
          <tr><td><b>Experience</b></td><td>{candidate.experience_type}</td></tr>
          <tr><td><b>Previous Company</b></td><td>{candidate.previous_company or '-'}</td></tr>
          <tr><td><b>Qualification</b></td><td>{candidate.highest_qualification}</td></tr>
          <tr><td><b>Role (Mahavir)</b></td><td>{candidate.role}</td></tr>
        </table>

        <p>
          <a href="{link}" style="padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px">
            View Candidate (Valid 48 Hours)
          </a>
        </p>
        """

        send_email(
            to=hr_email,
            subject="HR Candidate Access (Valid 48 Hours)",
            html_content=html,
        )
