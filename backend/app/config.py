from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """애플리케이션 설정"""

    # Neople API
    neople_api_key: str
    neople_api_base_url: str = "https://api.neople.co.kr/df"

    # CORS
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Cache
    cache_ttl_seconds: int = 300  # 5분

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """설정 싱글톤 반환"""
    return Settings()
