"""add hr decision fields to candidates

Revision ID: c3c351f5222c
Revises: 0cb5504ffb9e
Create Date: 2026-01-26 15:17:22.364489
"""

from alembic import op
import sqlalchemy as sa

revision = "c3c351f5222c"
down_revision = "0cb5504ffb9e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Columns already added manually in DB
    pass


def downgrade() -> None:
    op.drop_column("candidates", "hr_decision_at")
    op.drop_column("candidates", "hr_decision_remarks")
    op.drop_column("candidates", "hr_decision")