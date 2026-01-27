# """add candidate linkedin resume and position fields

# Revision ID: 579381c1db68
# Revises: 
# Create Date: 2026-01-17 12:27:17.964587

# """
# from typing import Sequence, Union

# from alembic import op
# import sqlalchemy as sa


# # revision identifiers, used by Alembic.
# revision: str = '579381c1db68'
# down_revision: Union[str, Sequence[str], None] = None
# branch_labels: Union[str, Sequence[str], None] = None
# depends_on: Union[str, Sequence[str], None] = None


# def upgrade() -> None:
#     """Upgrade schema."""
#     pass


# def downgrade() -> None:
#     """Downgrade schema."""
#     pass




"""add candidate linkedin resume and position fields

Revision ID: 579381c1db68
Revises: 3db275fabe4e
Create Date: 2026-01-17 12:27:17.964587
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "579381c1db68"
down_revision: Union[str, Sequence[str], None] = "3db275fabe4e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "candidates",
        sa.Column("linkedin_url", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "candidates",
        sa.Column("resume_link", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "candidates",
        sa.Column("position_applied", sa.String(length=100), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("candidates", "position_applied")
    op.drop_column("candidates", "resume_link")
    op.drop_column("candidates", "linkedin_url")