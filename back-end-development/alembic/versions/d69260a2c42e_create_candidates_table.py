"""create candidates table

Revision ID: d69260a2c42e
Revises: 3bf9c2c26262
Create Date: 2026-01-10 11:58:44.375474
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import expression   # ✅ REQUIRED


# revision identifiers, used by Alembic.
revision: str = "d69260a2c42e"
down_revision: Union[str, Sequence[str], None] = "3bf9c2c26262"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # 1️⃣ Add is_active with default TRUE (backfill existing rows)
    op.add_column(
        "candidates",
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=expression.true(),
            nullable=False,
        ),
    )

    # 2️⃣ Add audit fields (safe, nullable)
    op.add_column(
        "candidates",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "candidates",
        sa.Column("deleted_by", sa.String(length=100), nullable=True),
    )

    # 3️⃣ Remove server default (important for clean schema)
    op.alter_column(
        "candidates",
        "is_active",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("candidates", "deleted_by")
    op.drop_column("candidates", "deleted_at")
    op.drop_column("candidates", "is_active")
