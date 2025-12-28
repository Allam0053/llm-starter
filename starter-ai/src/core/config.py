import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Config
    PROJECT_NAME: str = "LLM Starter API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # LLM Configuration
    LLM_PROVIDER: str = "ollama" # ollama, openai, gemini
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5-coder:3b"
    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    
    # Database Configuration
    # Uses standard Postgres URL format: postgresql://user:password@localhost:5432/db
    DATABASE_URL: str = "postgresql://langchain:langchain@localhost:5432/vectors"
    
    # Vector DB
    CHROMA_DB_DIR: str = "data/chroma"
    COLLECTION_NAME: str = "documents"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
