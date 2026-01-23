"""add teams meeting and recording fields to interviews

Revision ID: 82ea05c4dbbb
Revises: 9fbd8e62fe40
Create Date: 2026-01-24 01:49:37.327552

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '82ea05c4dbbb'
down_revision: Union[str, Sequence[str], None] = '9fbd8e62fe40'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
