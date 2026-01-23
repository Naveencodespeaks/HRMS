"""add teams meeting and recording fields to interviews

Revision ID: 943eb2d62f83
Revises: b513810c4327
Create Date: 2026-01-24 01:48:36.082100

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '943eb2d62f83'
down_revision: Union[str, Sequence[str], None] = 'b513810c4327'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
