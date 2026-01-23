"""add id column to interviews (already exists)

Revision ID: 34c3ce73a798
Revises: 353986be9d06
"""

from alembic import op

revision = "34c3ce73a798"
down_revision = "353986be9d06"
branch_labels = None
depends_on = None


def upgrade():
    # Column already exists in DB – no action needed
    pass


def downgrade():
    # We do not drop primary keys in production
    pass
