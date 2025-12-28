# LLM Backend Starter Guide

## 🚀 Overview
This is a production-ready starter template for building Large Language Model applications. It includes a structured directory layout, FastAPI backend, LangChain integration, and Dockerized infrastructure (Postgres + pgvector, ChromaDB, Ollama).

## 📂 Project Structure
```
src/
├── ai/                 # AI Logic (Agents, RAG, LLM Factories)
├── api/                # FastAPI Routes & Endpoints
├── core/               # Config, Logging, Database
├── domain/             # Pydantic Models & Schemas
└── workflows/          # Complex Chains & Pipelines
```

## 🛠️ Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python 3.10+](https://www.python.org/)
- [Ollama](https://ollama.com/) (Optional, for local LLMs)

## ⚡ Quick Start

### 1. Environment Setup
Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
*(Or create manually with the content below)*

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
DATABASE_URL=postgresql://langchain:langchain@localhost:5432/vectors
OPENAI_API_KEY=sk-...
```

### 3. Start Infrastructure
Run the database and vector store containers:
```bash
docker-compose up -d
```
This spins up:
- **Postgres (pgvector)**: Port 5432
- **Ollama**: Port 11434 (if not running locally)

### 4. Run the API
Start the FastAPI development server:
```bash
uvicorn src.api.main:app --reload
```
API Documentation will be available at: http://localhost:8000/docs

## 📝 Features
- **Structured Logging**: Chats are saved as JSON in `data/history/YYYY-MM-DD/`.
- **LLM Factory**: Easily switch between Ollama, OpenAI, and Gemini.
- **RAG Ready**: Set up for ChromaDB and Postgres Vector.

## 🧪 Testing
Run the test suite:
```bash
pytest
```
