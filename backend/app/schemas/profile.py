from typing import Optional, List
from pydantic import BaseModel, Field


class OnboardingRequest(BaseModel):
    goal: str  # internship, first_job, job_switch, freelancing, higher_studies, career_exploration
    target_role: str
    experience_level: str  # student, fresher, mid, senior, lead
    industry: str
    location_preference: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    avatar_url: Optional[str] = None
    summary: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    headline: Optional[str] = None
    avatar_url: Optional[str] = None
    summary: Optional[str] = None
    completeness_score: int = 85
    missing_sections: List[str] = Field(default_factory=list)
    has_completed_onboarding: bool = True
