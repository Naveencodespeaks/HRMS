"""baseline schema

Revision ID: b513810c4327
Revises: 7f80ffb7504e
Create Date: 2026-01-23 23:04:53.237964

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b513810c4327'
down_revision: Union[str, Sequence[str], None] = '7f80ffb7504e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
