import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Text, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class PlatformCampaign(Base):
    __tablename__ = "platform_campaigns"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    cta_text: Mapped[str] = mapped_column(String(100), default="Learn More")
    cta_url: Mapped[str] = mapped_column(String(1024), default="/dashboard")
    
    # Placement: banner, dashboard, template, career_tip
    campaign_type: Mapped[str] = mapped_column(String(50), default="career_tip")
    target_page: Mapped[str] = mapped_column(String(50), default="dashboard")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    impression_count: Mapped[int] = mapped_column(Integer, default=0)
    click_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
