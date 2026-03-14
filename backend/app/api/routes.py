from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse, HealthResponse
from app.services.rag_service import RAGService
from app.utils.code_utils import detect_language, count_lines
from app.core.config import get_settings, Settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Singleton — embeddings model loads once, reused for every request
_rag_service: RAGService | None = None

def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        logger.info("Initializing RAGService (loading embeddings model)...")
        _rag_service = RAGService()
        logger.info("RAGService ready.")
    return _rag_service

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check(settings: Settings = Depends(get_settings)):
    return HealthResponse(status="ok", version="1.0.0", model=settings.groq_model)

@router.post("/analyze", response_model=AnalyzeResponse, tags=["RAG"])
async def analyze_code(request: AnalyzeRequest, rag: RAGService = Depends(get_rag_service)):
    try:
        language = request.language or detect_language(request.filename)
        summary = await rag.summarize(request.code, request.filename, language)
        return AnalyzeResponse(
            summary=summary,
            language=language,
            filename=request.filename,
            line_count=count_lines(request.code),
        )
    except Exception as e:
        logger.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse, tags=["RAG"])
async def chat_with_code(request: ChatRequest, rag: RAGService = Depends(get_rag_service)):
    try:
        language = request.language or detect_language(request.filename)
        result = await rag.chat(
            question=request.question,
            code=request.code,
            filename=request.filename,
            language=language,
            chat_history=request.chat_history,
        )
        return ChatResponse(answer=result["answer"], sources=result["sources"])
    except Exception as e:
        logger.error(f"Chat failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
