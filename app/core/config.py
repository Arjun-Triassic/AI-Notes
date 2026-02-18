from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env: Literal["local", "dev", "prod"] = "local"

    project_name: str = "AI Notes App"
    api_v1_prefix: str = "/api/v1"

    backend_cors_origins: list[str] = ["http://localhost:5173"]

    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/ai_notes"

    jwt_secret_key: str = "CHANGE_ME"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    openai_api_key: str | None = None

    redis_url: str = "redis://redis:6379/0"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


