from fastapi import FastAPI
from deployments.router import router as deployments_router

app = FastAPI()

app.include_router(deployments_router)