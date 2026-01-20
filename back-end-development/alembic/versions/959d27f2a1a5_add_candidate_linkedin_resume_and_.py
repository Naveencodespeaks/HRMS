"""add candidate linkedin resume and position fields

Revision ID: 959d27f2a1a5
Revises: e5c41c78c0f6
Create Date: 2026-01-17 10:33:01.258010

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '959d27f2a1a5'
down_revision: Union[str, Sequence[str], None] = 'e5c41c78c0f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
