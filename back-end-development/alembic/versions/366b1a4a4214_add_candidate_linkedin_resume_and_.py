"""add candidate linkedin resume and position fields

Revision ID: 366b1a4a4214
Revises: 959d27f2a1a5
Create Date: 2026-01-17 12:00:01.737067

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '366b1a4a4214'
down_revision: Union[str, Sequence[str], None] = '959d27f2a1a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
