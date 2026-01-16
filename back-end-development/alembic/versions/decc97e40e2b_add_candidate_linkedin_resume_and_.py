"""add candidate linkedin resume and position fields

Revision ID: decc97e40e2b
Revises: 43f28f9bcda5
Create Date: 2026-01-16 18:23:53.192535

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'decc97e40e2b'
down_revision: Union[str, Sequence[str], None] = '43f28f9bcda5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
