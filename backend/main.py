import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import get_settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    s = get_settings()
    logger.info("🚀 RagGit starting...")
    logger.info(f"   Model: {s.groq_model} (Groq)")
    # Pre-warm the RAGService so the HuggingFace model loads at startup,
    # not on the first user request (which would cause a timeout).
    from app.api.routes import get_rag_service
    logger.info("⏳ Loading embeddings model (this may take a moment)...")
    get_rag_service()
    logger.info("✅ Embeddings model ready — all requests will be fast.")
    yield
    logger.info("🛑 Shutting down...")

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="RagGit",
        description="Chat with any GitHub file using AI-powered RAG",
        version="1.0.0",
        lifespan=lifespan,
    )
    origins = ["*"] if settings.allowed_origins == "*" else settings.allowed_origins.split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router, prefix="/api")
    return app

app = create_app()
