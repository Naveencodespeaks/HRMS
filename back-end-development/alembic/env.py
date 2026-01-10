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
# App imports (IMPORTANT: single reminder imports)
# -------------------------------------------------
from src.app.core.config import settings
from src.app.core.db import sync_engine, Base

# Import models so Alembic can see them
# (Do NOT remove even if unused)
import src.app.models  # noqa: F401

# -------------------------------------------------
# Alembic config
# -------------------------------------------------
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ✅ This metadata MUST come from core.db.Base
target_metadata = Base.metadata

# -------------------------------------------------
# Offline migrations
# -------------------------------------------------
def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url_sync,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
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
