import uuid
from datetime import datetime
from typing import List
from sqlalchemy import String, DateTime, ForeignKey, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ATSReport(Base):
    __tablename__ = "ats_reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id: Mapped[str] = mapped_column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), index=True)

    overall_score: Mapped[int] = mapped_column(Integer, default=0)
    keywords_score: Mapped[int] = mapped_column(Integer, default=0)
    skills_score: Mapped[int] = mapped_column(Integer, default=0)
    experience_score: Mapped[int] = mapped_column(Integer, default=0)
    formatting_score: Mapped[int] = mapped_column(Integer, default=0)
    achievements_score: Mapped[int] = mapped_column(Integer, default=0)

    missing_keywords: Mapped[List[str]] = mapped_column(JSON, default=list)
    strong_points: Mapped[List[str]] = mapped_column(JSON, default=list)
    suggestions: Mapped[List[str]] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    resume: Mapped["Resume"] = relationship("Resume", back_populates="ats_reports")
