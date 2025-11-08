from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///echobloom.db"
    qdrant_url: str = "http://localhost:6333"
    gemini_api_key: str = ""
    clerk_secret_key: str = ""
    encryption_key: str = "your-encryption-key-here"  # In production, use env
    secret_key: str = ""
    qdrant_api_key: str = ""

    class Config:
        env_file = ".env"

settings = Settings()