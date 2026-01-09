from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.app.core.db import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
async def health(db: AsyncSession = Depends(get_db)):
    # simple DB ping
    result = await db.execute(text("SELECT 1"))
    return {"status": "ok", "db": result.scalar_one()}
