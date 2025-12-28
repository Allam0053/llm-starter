from langchain_core.messages import HumanMessage
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from src.ai.llm.factory import get_llm
from src.core.logger import log_chat
import logging

logger = logging.getLogger(__name__)

# Simple in-memory history for now (could be replaced with Postgres/Redis)
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# ... (imports)

class ChatService:
    @staticmethod
    async def generate_response(message: str, session_id: str = "default"):
        try:
            llm = get_llm()
            
            # Create a prompt template that handles history
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a helpful AI assistant."),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ])
            
            chain = prompt | llm
            
            with_message_history = RunnableWithMessageHistory(
                chain,
                get_session_history,
                input_messages_key="input",
                history_messages_key="history",
            )
            
            config = {"configurable": {"session_id": session_id}}
            full_response = ""
            
            # Use astream for streaming
            # Stream events: dataUpdate, dataComplete, dataFailed
            async for chunk in with_message_history.astream(
                {"input": message},
                config=config
            ):
                content = chunk.content
                if content:
                    full_response += content
                    # Format for SSE
                    clean_content = content.replace('\n', '\\n')
                    yield f"event: dataUpdate\ndata: {clean_content}\n\n"
            
            # Log the complete conversation
            log_chat(prompt=message, response=full_response, metadata={"session_id": session_id})
            
            yield "event: dataComplete\ndata: \n\n"

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            yield f"event: dataFailed\ndata: error: {str(e)}\n\n"
