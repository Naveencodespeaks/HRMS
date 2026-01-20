"""add candidate linkedin resume and position fields

Revision ID: e5c41c78c0f6
Revises: decc97e40e2b
Create Date: 2026-01-17 10:32:27.200685

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5c41c78c0f6'
down_revision: Union[str, Sequence[str], None] = 'decc97e40e2b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
