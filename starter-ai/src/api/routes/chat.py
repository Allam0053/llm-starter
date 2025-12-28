from fastapi import APIRouter
from pydantic import BaseModel
from src.domain.services.chat import ChatService
from fastapi.responses import StreamingResponse

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

@router.post("/api/chat")
async def chat(request: ChatRequest):
    # Use session_id if provided, else define a default or generate one
    session = request.session_id or "default_session"
    return StreamingResponse(
        ChatService.generate_response(request.message, session_id=session),
        media_type="text/event-stream"
    )
