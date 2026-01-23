"""add status column to candidates

Revision ID: 6117cd09bbed
Revises: cb24718fb581
Create Date: 2026-01-23 20:25:17.335323

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6117cd09bbed'
down_revision: Union[str, Sequence[str], None] = 'cb24718fb581'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "candidates",
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="APPLIED",
        ),
    )

    op.create_index(
        "ix_candidates_status",
        "candidates",
        ["status"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_candidates_status", table_name="candidates")
    op.drop_column("candidates", "status")
