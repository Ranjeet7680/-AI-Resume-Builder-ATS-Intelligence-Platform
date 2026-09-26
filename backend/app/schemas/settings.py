from typing import Optional, List
from pydantic import BaseModel, Field


class UserSettings(BaseModel):
    theme: str = "system"  # light, dark, system
    language: str = "en"  # en, hi, bn, mr, gu, ta, te, kn, ml, pa, or, as
    voice_speed: float = 1.0
    voice_id: str = "default_en"
    auto_play_voice: bool = True
    notifications_email: bool = True
    notifications_interviews: bool = True
    notifications_applications: bool = True
    public_profile_enabled: bool = True
    analytics_enabled: bool = True
    plan: str = "pro"  # free, pro, enterprise
    max_resumes_allowed: int = 25


class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    voice_speed: Optional[float] = None
    voice_id: Optional[str] = None
    auto_play_voice: Optional[bool] = None
    notifications_email: Optional[bool] = None
    notifications_interviews: Optional[bool] = None
    notifications_applications: Optional[bool] = None
    public_profile_enabled: Optional[bool] = None
    analytics_enabled: Optional[bool] = None
