from fastapi import FastAPI
from src.app.api.router import api_router

app = FastAPI(tilte="Interivew on boarding process automation", version="1.0.0")

app.include_router(api_router, prefix="/api/v1")