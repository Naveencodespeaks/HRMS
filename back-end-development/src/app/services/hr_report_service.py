# # src/app/services/hr_service.py

# import uuid
# from datetime import datetime, timedelta
# from sqlalchemy.ext.asyncio import AsyncSession

# from src.app.models.hr_access_link import HRAccessLink
# from src.app.models.candidate import Candidate
# from src.app.utils.email import send_candidate_confirmation_email as send_email


# class HRAccessService:
#     @staticmethod
#     async def create_hr_access_link(
#         db: AsyncSession,
#         candidate: Candidate,
#         hr_email: str,
#     ) -> str:
#         token = str(uuid.uuid4())
#         expires_at = datetime.utcnow() + timedelta(hours=48)

#         access_link = HRAccessLink(
#             candidate_id=candidate.id,
#             token=token,
#             expires_at=expires_at,
#             used=False,
#         )

#         db.add(access_link)
#         await db.commit()
#         await db.refresh(access_link)

#         # Send email
#         await HRAccessService.send_hr_email(
#             hr_email=hr_email,
#             candidate=candidate,
#             token=token,
#         )

#         return token

#     @staticmethod
#     async def send_hr_email(
#         hr_email: str,
#         candidate: Candidate,
#         token: str,
#     ):
#         link = f"https://mahavirgroup.co/hr-access/{token}"

#         html = f"""
#         <h3>Candidate Short Profile</h3>
#         <table border="1" cellpadding="8" cellspacing="0">
#           <tr><td><b>Name</b></td><td>{candidate.first_name} {candidate.last_name}</td></tr>
#           <tr><td><b>Experience</b></td><td>{candidate.experience_type}</td></tr>
#           <tr><td><b>Previous Company</b></td><td>{candidate.previous_company or '-'}</td></tr>
#           <tr><td><b>Qualification</b></td><td>{candidate.highest_qualification}</td></tr>
#           <tr><td><b>Role (Mahavir)</b></td><td>{candidate.role}</td></tr>
#         </table>

#         <p>
#           <a href="{link}" style="padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px">
#             View Candidate (Valid 48 Hours)
#           </a>
#         </p>
#         """

#         send_email(
#             to=hr_email,
#             subject="HR Candidate Access (Valid 48 Hours)",
#             html_content=html,
#         )





# src/app/services/hr_report_service.py

from __future__ import annotations

import io
import uuid
from datetime import datetime
from collections import defaultdict
from typing import Dict, List

import pandas as pd
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.models.candidate import Candidate
from src.app.models.hr_access_link import HRAccessLink
from src.app.core.config import settings
from src.app.utils.email import send_email


class HRReportService:
    """
    Daily HR report service.
    Triggered ONLY by scheduler.
    """

    # -------------------------------------------------
    # MAIN ENTRY (called by APScheduler)
    # -------------------------------------------------
    @staticmethod
    async def send_daily_hr_report(
        *,
        db: AsyncSession,
        start_dt: datetime,
        end_dt: datetime,
    ) -> None:
        """
        Generate daily HR report and send email.
        """

        # 1️⃣ Fetch candidates in time window
        candidates = await HRReportService._fetch_candidates(
            db=db,
            start_dt=start_dt,
            end_dt=end_dt,
        )

        # 2️⃣ Build role-wise summary
        summary = HRReportService._build_summary(candidates)

        # 3️⃣ Generate Excel (in-memory)
        excel_bytes = HRReportService._generate_excel(candidates)

        # 4️⃣ Create secure download link
        report_link = await HRReportService._create_secure_report_link(
            db=db,
            excel_bytes=excel_bytes,
        )

        # 5️⃣ Send HR email
        HRReportService._send_hr_email(
            summary=summary,
            report_link=report_link,
            start_dt=start_dt,
            end_dt=end_dt,
        )

    # -------------------------------------------------
    # FETCH CANDIDATES
    # -------------------------------------------------
    @staticmethod
    async def _fetch_candidates(
        *,
        db: AsyncSession,
        start_dt: datetime,
        end_dt: datetime,
    ) -> List[Candidate]:
        stmt = select(Candidate).where(
            and_(
                Candidate.created_at >= start_dt,
                Candidate.created_at < end_dt,
                Candidate.is_active == True,
            )
        )

        result = await db.execute(stmt)
        return result.scalars().all()

    # -------------------------------------------------
    # SUMMARY
    # -------------------------------------------------
    @staticmethod
    def _build_summary(
        candidates: List[Candidate],
    ) -> Dict[str, int]:
        summary = defaultdict(int)

        for c in candidates:
            role = c.role or "Unassigned"
            summary[role] += 1

        summary["Total"] = len(candidates)
        return dict(summary)

    # -------------------------------------------------
    # EXCEL GENERATION
    # -------------------------------------------------
    @staticmethod
    def _generate_excel(
        candidates: List[Candidate],
    ) -> bytes:
        rows = []

        for c in candidates:
            rows.append(
                {
                    "Candidate Name": f"{c.first_name} {c.last_name}",
                    "Email": c.email,
                    "Phone": c.phone,
                    "Role": c.role,
                    "Experience (Years)": c.total_experience_years,
                    "Current CTC": c.current_ctc,
                    "Expected CTC": c.expected_ctc,
                    "Applied Date": c.created_at.strftime("%Y-%m-%d %H:%M"),
                    "Resume Link": c.resume_url,
                }
            )

        df = pd.DataFrame(rows)

        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
            df.to_excel(writer, index=False, sheet_name="Daily Applications")

        buffer.seek(0)
        return buffer.read()

    # -------------------------------------------------
    # SECURE LINK CREATION
    # -------------------------------------------------
    @staticmethod
    async def _create_secure_report_link(
        *,
        db: AsyncSession,
        excel_bytes: bytes,
    ) -> str:
        """
        Store Excel in DB as secure temporary report.
        (48-hour validity)
        """

        token = str(uuid.uuid4())
        expires_at = datetime.utcnow().replace(microsecond=0)

        report = HRAccessLink(
            candidate_id=None,          # report-level link
            token=token,
            expires_at=expires_at,
            used=False,
            file_blob=excel_bytes,      # ⚠ requires BYTEA column
        )

        db.add(report)
        await db.commit()

        return f"https://mahavirgroup.co/hr-report/{token}"

    # -------------------------------------------------
    # EMAIL
    # -------------------------------------------------
    @staticmethod
    def _send_hr_email(
        *,
        summary: Dict[str, int],
        report_link: str,
        start_dt: datetime,
        end_dt: datetime,
    ) -> None:
        date_label = start_dt.strftime("%d %B %Y")

        summary_lines = []
        for role, count in summary.items():
            if role != "Total":
                summary_lines.append(f"- {role}: <b>{count}</b>")

        summary_html = "<br>".join(summary_lines)

        html = f"""
        <p>Dear HR Team,</p>

        <p>
        Please find below the summary of candidate applications received through
        the recruitment portal on <b>{date_label}</b>.
        </p>

        <h4>Application Summary</h4>
        {summary_html}
        <p><b>Total Applications:</b> {summary.get("Total", 0)}</p>

        <p>
        The detailed Excel report can be accessed using the link below:
        </p>

        <p>
        <a href="{report_link}"
           style="padding:10px 16px;background:#2563eb;color:white;
                  text-decoration:none;border-radius:6px">
            Download Excel Report
        </a>
        </p>

        <p>
        This is an automated system-generated report.
        </p>

        <p>
        Regards,<br>
        <b>Mahavir Group</b><br>
        Recruitment & HR Systems
        </p>
        """

        send_email(
            to=settings.mail_from,
            subject=f"Daily Recruitment Application Report | {date_label}",
            html_content=html,
        )
