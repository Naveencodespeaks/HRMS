"""add is_used to hr_access_links


Revision ID: 7fb2292e690b
Revises: 456e2b4adc7e
Create Date: 2026-01-27 09:50:30.145847
"""


from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "7fb2292e690b"
down_revision: Union[str, Sequence[str], None] = "456e2b4adc7e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None




def upgrade() -> None:
# ✅ ADD COLUMN
    op.add_column(
    "hr_access_links",
    sa.Column(
    "is_used",
    sa.Boolean(),
    nullable=False,
    server_default=sa.text("false"),
    ),
    )




def downgrade() -> None:
# ⬅️ ROLLBACK
    op.drop_column("hr_access_links", "is_used")