"""Fix HR access links model

Revision ID: 456e2b4adc7e
Revises: 2450d7fe3be6
Create Date: 2026-01-26 20:59:01.745836
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "456e2b4adc7e"
down_revision: Union[str, Sequence[str], None] = "2450d7fe3be6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    - Remove one-time-use logic (is_used) IF present
    - Ensure open_count has correct default
    """

    # 🔒 Drop is_used column only if it exists
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'hr_access_links'
                AND column_name = 'is_used'
            ) THEN
                ALTER TABLE hr_access_links DROP COLUMN is_used;
            END IF;
        END $$;
        """
    )

    # ✅ Ensure open_count default
    op.execute(
        "ALTER TABLE hr_access_links "
        "ALTER COLUMN open_count SET DEFAULT 0"
    )


def downgrade() -> None:
    """
    - Restore is_used column if missing
    - Remove open_count default
    """

    # 🔁 Add is_used only if it does NOT exist
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'hr_access_links'
                AND column_name = 'is_used'
            ) THEN
                ALTER TABLE hr_access_links
                ADD COLUMN is_used BOOLEAN NOT NULL DEFAULT false;
            END IF;
        END $$;
        """
    )

    op.execute(
        "ALTER TABLE hr_access_links "
        "ALTER COLUMN open_count DROP DEFAULT"
    )