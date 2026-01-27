"""add hr decision fields to candidates

Revision ID: 08e577a8c225
Revises: 82ea05c4dbbb
Create Date: 2026-01-24 12:14:53.520676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '08e577a8c225'
down_revision: Union[str, Sequence[str], None] = '82ea05c4dbbb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
