"""merge interview meeting fields with hr decisions

Revision ID: 0cb5504ffb9e
Revises: 08e577a8c225, add_meeting_fields_to_interviews
Create Date: 2026-01-26 14:19:48.158209

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0cb5504ffb9e'
down_revision: Union[str, Sequence[str], None] = ('08e577a8c225', 'add_meeting_fields_to_interviews')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
