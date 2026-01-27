"""add audit fields to hr_access_links

Revision ID: 3806a6ce008d
Revises: c3c351f5222c
Create Date: 2026-01-26 16:08:55.183655
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3806a6ce008d"
down_revision: Union[str, Sequence[str], None] = "c3c351f5222c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 🔍 HR access audit fields
    op.add_column(
        "hr_access_links",
        sa.Column("opened_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "hr_access_links",
        sa.Column("opened_by", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "hr_access_links",
        sa.Column(
            "open_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )


def downgrade() -> None:
    op.drop_column("hr_access_links", "open_count")
    op.drop_column("hr_access_links", "opened_by")
    op.drop_column("hr_access_links", "opened_at")