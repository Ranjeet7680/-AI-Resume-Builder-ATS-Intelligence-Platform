from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.ai import router as ai_router
from app.api.ats import router as ats_router
from app.api.jobs import router as jobs_router
from app.api.export import router as export_router
from app.api.tailor import router as tailor_router
from app.api.analysis import router as analysis_router
from app.api.chat import router as chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and vector support
    await init_db()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI Resume Intelligence & ATS Optimization Platform",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register direct endpoints at root
app.include_router(auth_router)
app.include_router(chat_router)

# Register API v1 Routers
api_v1_prefix = "/api/v1"
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(chat_router, prefix=api_v1_prefix)
app.include_router(resume_router, prefix=api_v1_prefix)
app.include_router(ai_router, prefix=api_v1_prefix)
app.include_router(ats_router, prefix=api_v1_prefix)
app.include_router(jobs_router, prefix=api_v1_prefix)
app.include_router(export_router, prefix=api_v1_prefix)
app.include_router(tailor_router, prefix=api_v1_prefix)
app.include_router(analysis_router, prefix=api_v1_prefix)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
    }


@app.get("/healthz")
async def health_check():
    return {"status": "healthy"}
