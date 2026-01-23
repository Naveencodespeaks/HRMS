# src/app/core/scheduler.py

from __future__ import annotations

import logging
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from src.app.core.db import AsyncSessionLocal  
from src.app.services.hr_report_service import HRReportService  # you will implement report logic here

logger = logging.getLogger(__name__)

IST = ZoneInfo("Asia/Kolkata")

scheduler = AsyncIOScheduler(timezone=IST)


def _get_report_window_ist(now_ist: datetime) -> tuple[datetime, datetime]:
    """
    Report window:
      yesterday 09:00 AM IST  -> today 09:00 AM IST
    Job runs at 10:00 AM IST.
    """
    today = now_ist.date()
    start_dt = datetime.combine(today - timedelta(days=1), time(9, 0), tzinfo=IST)
    end_dt = datetime.combine(today, time(9, 0), tzinfo=IST)
    return start_dt, end_dt


async def run_hr_daily_report_job() -> None:
    """
    APScheduler job: generate HR report + email at 10:00 AM IST daily
    """
    now_ist = datetime.now(IST)
    start_dt, end_dt = _get_report_window_ist(now_ist)

    logger.info(
        "HR daily report job started | window=%s -> %s",
        start_dt.isoformat(),
        end_dt.isoformat(),
    )

    try:
        async with AsyncSessionLocal() as db:
            # HRService will:
            # 1) query candidates in window
            # 2) build role-wise summary
            # 3) generate excel
            # 4) store excel and create secure link
            # 5) email HR
            await HRReportService.send_daily_hr_report(
                db=db,
                start_dt=start_dt,
                end_dt=end_dt,
            )

        logger.info("HR daily report job completed successfully")

    except Exception as e:
        logger.exception("HR daily report job failed: %r", e)


def start_scheduler() -> None:
    """
    Attach job to scheduler and start it.
    """
    if scheduler.running:
        return

    # Runs every day at 10:00 AM IST
    scheduler.add_job(
        run_hr_daily_report_job,
        trigger=CronTrigger(hour=10, minute=0),
        id="hr_daily_report_10am",
        replace_existing=True,
        max_instances=1,
        misfire_grace_time=60 * 10,  # 10 mins grace if server busy
        coalesce=True,
    )

    scheduler.start()
    logger.info("Scheduler started with HR daily report job at 10:00 AM IST")


def shutdown_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler shutdown complete")