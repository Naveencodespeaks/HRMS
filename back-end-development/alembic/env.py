import sys
from pathlib import Path
from logging.config import fileConfig

from alembic import context

# -------------------------------------------------
# Path setup (for src/ layout)
# -------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = BASE_DIR / "src"
sys.path.insert(0, str(SRC_DIR))

# -------------------------------------------------
# App imports
# -------------------------------------------------
from app.core.config import settings
from app.core.db import sync_engine
from app.models import Base

# -------------------------------------------------
# Alembic config
# -------------------------------------------------
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# -------------------------------------------------
# Offline migrations
# -------------------------------------------------
def run_migrations_offline() -> None:
    context.configure(
        url=settings.sync_database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# -------------------------------------------------
# Online migrations
# -------------------------------------------------
def run_migrations_online() -> None:
    with sync_engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()

# -------------------------------------------------
# Entrypoint
# -------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
