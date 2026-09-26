import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, DateTime, Text, ForeignKey, JSON, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True)

    title: Mapped[str] = mapped_column(String(255), default="My Resume")
    target_role: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    template_id: Mapped[str] = mapped_column(String(64), default="modern-ats")
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    public_slug: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Personal & Contact Information
    personal_info: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "fullName": "",
            "headline": "",
            "email": "",
            "phone": "",
            "location": "",
            "website": "",
            "linkedin": "",
            "github": "",
            "summary": "",
        },
    )

    # Core Resume Sections (Stored as structured JSON for agile editing & schema evolution)
    experiences: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    education: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    skills: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    projects: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    certifications: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)

    # Cached ATS Metric
    ats_score: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="resumes")
    ats_reports: Mapped[List["ATSReport"]] = relationship("ATSReport", back_populates="resume", cascade="all, delete-orphan")
    job_matches: Mapped[List["JobMatch"]] = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
