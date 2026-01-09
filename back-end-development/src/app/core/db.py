from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine

from src.app.core.config import settings

Base = declarative_base()

# 🔵 ASYNC engine (FastAPI)
async_engine = create_async_engine(
    settings.database_url_async,
    echo=False,
    future=True,
)

AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 🟢 SYNC engine (Alembic ONLY)
sync_engine = create_engine(
    settings.database_url_sync,  # ✅ FIXED
    echo=False,
    future=True,
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
