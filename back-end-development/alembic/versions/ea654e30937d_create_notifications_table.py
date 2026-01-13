"""create notifications table

Revision ID: ea654e30937d
Revises: 6653f3e103f2
Create Date: 2026-01-13 18:12:55.086162

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea654e30937d'
down_revision: Union[str, Sequence[str], None] = '6653f3e103f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
