from src.api.routes.chat import router
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.core.config import settings
from fastapi.middleware.cors import CORSMiddleware


origins = ['*']

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Connect to DBs, etc.
    print(f"Starting {settings.PROJECT_NAME}...")
    yield
    # Shutdown logic
    print("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs",
        "version": settings.VERSION
    }

# Include routers here later
# from src.api.routes import chat
# app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
