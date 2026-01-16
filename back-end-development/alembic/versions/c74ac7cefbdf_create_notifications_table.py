"""create notifications table

Revision ID: c74ac7cefbdf
Revises: ea654e30937d
Create Date: 2026-01-14 10:18:03.290488
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "c74ac7cefbdf"
down_revision: Union[str, Sequence[str], None] = "ea654e30937d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "notifications",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("entity_id", sa.String(length=64), nullable=True),
        sa.Column(
            "is_read",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_index("ix_notifications_role", "notifications", ["role"])
    op.create_index("ix_notifications_is_read", "notifications", ["is_read"])
    op.create_index(
        "ix_notifications_created_at", "notifications", ["created_at"]
    )
    op.create_index(
        "ix_notifications_entity_id", "notifications", ["entity_id"]
    )


def downgrade() -> None:
    op.drop_index("ix_notifications_entity_id", table_name="notifications")
    op.drop_index("ix_notifications_created_at", table_name="notifications")
    op.drop_index("ix_notifications_is_read", table_name="notifications")
    op.drop_index("ix_notifications_role", table_name="notifications")
    op.drop_table("notifications")
