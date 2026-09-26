import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from app.config import settings

logger = logging.getLogger(__name__)

# Fallback to SQLite async in local dev if postgres URL is not available
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


async def init_db():
    """Initializes tables and vector extensions if using Postgres, falling back to SQLite if Postgres is unavailable."""
    global engine, AsyncSessionLocal
    try:
        async with engine.begin() as conn:
            # Enable pgvector if Postgres is used
            if "postgresql" in str(engine.url):
                try:
                    await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
                    logger.info("pgvector extension initialized or already exists.")
                except Exception as e:
                    logger.warning(f"Could not enable pgvector extension (lack SUPERUSER or not supported): {e}")

            # Create all tables defined in models
            await conn.run_sync(Base.metadata.create_all)
            logger.info(f"Database tables verified/created successfully using {engine.url.drivername}.")
    except Exception as e:
        if "postgresql" in str(engine.url):
            logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite async database.")
            fallback_url = "sqlite+aiosqlite:///./resume_builder.db"
            engine = create_async_engine(fallback_url, echo=settings.DEBUG, future=True)
            AsyncSessionLocal.configure(bind=engine)
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Local SQLite database initialized successfully at ./resume_builder.db.")
        else:
            raise


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining an asynchronous database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
