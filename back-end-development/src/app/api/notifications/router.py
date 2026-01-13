from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from src.app.core.db import get_db
from src.app.models.notification import Notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


# ============================
# Get recruiter notifications
# ============================
@router.get("/recruiter")
async def get_recruiter_notifications(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Notification)
        .where(Notification.role == "recruiter")
        .order_by(Notification.created_at.desc())
        .limit(20)
    )

    return result.scalars().all()


# ============================
# Unread notification count
# ============================
@router.get("/recruiter/unread-count")
async def unread_notification_count(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(func.count(Notification.id)).where(
            Notification.role == "recruiter",
            Notification.is_read.is_(False),
        )
    )

    return {"count": result.scalar_one()}


# ============================
# Mark notification as read
# ============================
@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id)
    )
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found",
        )

    notification.is_read = True
    await db.commit()
    await db.refresh(notification)

    return {"status": "ok"}
