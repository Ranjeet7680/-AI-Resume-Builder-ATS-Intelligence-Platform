import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    job_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    salary_range: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    resume_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    resume_version_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Status: saved, applied, screening, interview, offer, rejected
    status: Mapped[str] = mapped_column(String(50), default="saved", index=True)
    applied_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    interview_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
