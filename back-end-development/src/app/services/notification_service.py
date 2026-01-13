from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, func

from src.app.models.notification import Notification


class NotificationService:

    # ---------------------------
    # Create Notification
    # ---------------------------
    @staticmethod
    async def create_candidate_notification(
        db: AsyncSession,
        candidate_id,
        candidate_name: str,
    ) -> Notification:
        try:
            notification = Notification(
                title="New Candidate Applied",
                message=f"{candidate_name} has submitted a new application",
                candidate_id=candidate_id,
                role="recruiter",
            )

            db.add(notification)
            await db.commit()
            await db.refresh(notification)

            return notification

        except SQLAlchemyError:
            await db.rollback()
            raise

    # ---------------------------
    # Fetch Recruiter Notifications
    # ---------------------------
    @staticmethod
    async def get_recruiter_notifications(
        db: AsyncSession,
        limit: int = 20,
    ):
        result = await db.execute(
            select(Notification)
            .where(Notification.role == "recruiter")
            .order_by(Notification.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()

    # ---------------------------
    # Unread Count
    # ---------------------------
    @staticmethod
    async def get_unread_count(db: AsyncSession) -> int:
        result = await db.execute(
            select(func.count(Notification.id)).where(
                Notification.role == "recruiter",
                Notification.is_read.is_(False),
            )
        )
        return result.scalar_one()

    # ---------------------------
    # Mark as Read
    # ---------------------------
    @staticmethod
    async def mark_as_read(
        db: AsyncSession,
        notification_id,
    ):
        result = await db.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        notification = result.scalar_one_or_none()

        if not notification:
            return None

        notification.is_read = True
        await db.commit()
        await db.refresh(notification)
        return notification
