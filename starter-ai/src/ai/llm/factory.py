# Example logic for src/ai/llm/factory.py
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from src.core.config import settings

def get_llm():
    if settings.LLM_PROVIDER == "ollama":
        return ChatOllama(model=settings.OLLAMA_MODEL, base_url=settings.OLLAMA_BASE_URL)
    elif settings.LLM_PROVIDER == "openai":
        return ChatOpenAI(api_key=settings.OPENAI_API_KEY)
    # Add Gemini etc here