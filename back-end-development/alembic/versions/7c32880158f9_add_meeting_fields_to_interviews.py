from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "add_meeting_fields_to_interviews"
down_revision = "579381c1db68"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "interviews",
        sa.Column("meeting_platform", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "interviews",
        sa.Column("meeting_link", sa.Text(), nullable=True),
    )
    op.add_column(
        "interviews",
        sa.Column("recording_url", sa.Text(), nullable=True),
    )
    op.add_column(
        "interviews",
        sa.Column("recording_status", sa.String(length=50), nullable=True),
    )


def downgrade():
    op.drop_column("interviews", "recording_status")
    op.drop_column("interviews", "recording_url")
    op.drop_column("interviews", "meeting_link")
    op.drop_column("interviews", "meeting_platform")