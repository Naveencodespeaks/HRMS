from fastapi import APIRouter

from src.app.api.health import router as health_router
from src.app.api.candidates.router import router as candidates_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(candidates_router)



