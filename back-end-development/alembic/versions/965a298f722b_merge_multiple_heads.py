"""merge multiple heads

Revision ID: 965a298f722b
Revises: 366b1a4a4214, 579381c1db68
Create Date: 2026-01-20 16:01:14.712494

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '965a298f722b'
down_revision: Union[str, Sequence[str], None] = ('366b1a4a4214', '579381c1db68')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
