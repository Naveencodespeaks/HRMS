"""add teams meeting and recording fields to interviews

Revision ID: 9fbd8e62fe40
Revises: 7348607ea3c4
Create Date: 2026-01-24 01:49:28.221931

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9fbd8e62fe40'
down_revision: Union[str, Sequence[str], None] = '7348607ea3c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
