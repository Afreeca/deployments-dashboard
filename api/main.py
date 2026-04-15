from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from deployments.router import router as deployments_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(deployments_router)
