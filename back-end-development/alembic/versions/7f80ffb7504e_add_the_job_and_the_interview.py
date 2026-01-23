"""add the job and the interview

Revision ID: 7f80ffb7504e
Revises: 34c3ce73a798
Create Date: 2026-01-23 22:47:45.744951

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7f80ffb7504e'
down_revision: Union[str, Sequence[str], None] = '34c3ce73a798'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
