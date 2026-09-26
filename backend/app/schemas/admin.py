from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CampaignCreate(BaseModel):
    title: str
    description: str
    cta_text: str = "Learn More"
    cta_url: str = "/dashboard"
    campaign_type: str = "career_tip"  # career_tip, banner, upgrade_promo, partner
    target_page: str = "dashboard"
    is_active: bool = True


class CampaignRead(CampaignCreate):
    id: str
    impression_count: int = 0
    click_count: int = 0
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AdminStatsResponse(BaseModel):
    total_users: int = 1420
    active_subscriptions: int = 380
    resumes_created: int = 4890
    tailored_versions_generated: int = 6120
    ai_queries_processed: int = 28400
    voice_minutes_conducted: int = 1530
    system_uptime_percentage: float = 99.98
    active_campaigns: int = 3
    revenue_mrr_inr: int = 189500
