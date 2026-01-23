"""fix interview model

Revision ID: 353986be9d06
Revises: 6117cd09bbed
Create Date: 2026-01-23 21:48:35.652668
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision = "353986be9d06"
down_revision = "6117cd09bbed"
branch_labels = None
depends_on = None


def upgrade():
    # 1️⃣ Add interview_type (TEMP nullable)
    op.add_column(
        "interviews",
        sa.Column("interview_type", sa.String(50), nullable=True),
    )

    # 2️⃣ Add rating
    op.add_column(
        "interviews",
        sa.Column("rating", sa.Integer(), nullable=True),
    )

    # 3️⃣ Backfill interview_type for existing rows
    op.execute(
        "UPDATE interviews SET interview_type = 'Technical' WHERE interview_type IS NULL"
    )

    # 4️⃣ Enforce NOT NULL after backfill
    op.alter_column(
        "interviews",
        "interview_type",
        nullable=False,
    )

    # 5️⃣ Fix status default properly
    op.alter_column(
        "interviews",
        "status",
        server_default=sa.text("'SCHEDULED'"),
    )

    # 6️⃣ Ensure scheduled_at is NOT NULL (only if safe)
    op.execute(
        "UPDATE interviews SET scheduled_at = created_at WHERE scheduled_at IS NULL"
    )
    op.alter_column(
        "interviews",
        "scheduled_at",
        nullable=False,
    )


def downgrade():
    op.alter_column(
        "interviews",
        "status",
        server_default=None,
    )

    op.drop_column("interviews", "rating")
    op.drop_column("interviews", "interview_type")
