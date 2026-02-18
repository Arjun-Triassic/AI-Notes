from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_ai, routes_auth, routes_notes
from app.core.config import get_settings


settings = get_settings()

app = FastAPI(title=settings.project_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_auth.router, prefix=settings.api_v1_prefix)
app.include_router(routes_notes.router, prefix=settings.api_v1_prefix)
app.include_router(routes_ai.router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


