"""add candidate status column

Revision ID: cb24718fb581
Revises: 32aad2d9355a
Create Date: 2026-01-23 20:18:53.106941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cb24718fb581'
down_revision: Union[str, Sequence[str], None] = '32aad2d9355a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
