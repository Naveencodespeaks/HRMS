from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.app.core.scheduler import start_scheduler, shutdown_scheduler


from src.app.api.router import api_router

app = FastAPI(
    title="Interview Onboarding Process Automation",
    version="1.0.0",
)

# ✅ CORS CONFIG (THIS FIXES "Failed to fetch")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    start_scheduler()

@app.on_event("shutdown")
async def on_shutdown():
    shutdown_scheduler()

# ✅ API ROUTES
# app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router)
