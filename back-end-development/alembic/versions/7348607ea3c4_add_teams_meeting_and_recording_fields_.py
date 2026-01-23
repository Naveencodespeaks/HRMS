"""add teams meeting and recording fields to interviews

Revision ID: 7348607ea3c4
Revises: 943eb2d62f83
Create Date: 2026-01-24 01:49:20.117538

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7348607ea3c4'
down_revision: Union[str, Sequence[str], None] = '943eb2d62f83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
