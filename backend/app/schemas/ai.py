from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class ImproveBulletRequest(BaseModel):
    text: str
    target_role: Optional[str] = "Software Engineer"
    tone: Optional[str] = "impactful"


class ImproveBulletResponse(BaseModel):
    original_text: str
    improved_text: str
    alternatives: List[str] = []
    action_verb_used: Optional[str] = None
    rationale: str


class GenerateSummaryRequest(BaseModel):
    target_role: str
    years_of_experience: Optional[int] = 3
    skills: List[str] = []
    highlights: Optional[str] = None


class GenerateSummaryResponse(BaseModel):
    summary: str
    alternatives: List[str] = []


class ExtractSkillsRequest(BaseModel):
    text: str


class ExtractSkillsResponse(BaseModel):
    technical_skills: List[str]
    tools_frameworks: List[str]
    soft_skills: List[str]


# ------------------------------------------------------------------------------
# Module 8 & 9: Guided STAR / XYZ Experience & Project Builder
# ------------------------------------------------------------------------------
class StarBuilderRequest(BaseModel):
    role: str
    task_challenge: str
    technology: str
    action_taken: str
    result_metric: Optional[str] = None


class StarBuilderResponse(BaseModel):
    bullet_point: str
    action_verb: str
    alternative: str
    rationale: str


# ------------------------------------------------------------------------------
# Module 16: AI Career Assistant & Chat
# ------------------------------------------------------------------------------
class CareerChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class CareerChatRequest(BaseModel):
    messages: List[CareerChatMessage]
    target_role: Optional[str] = "Software Engineer"
    resume_context: Optional[str] = None


class CareerChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []


# ------------------------------------------------------------------------------
# Advanced: AI Cover Letter Generator
# ------------------------------------------------------------------------------
class CoverLetterRequest(BaseModel):
    job_title: str
    company: str
    job_description: str
    candidate_name: Optional[str] = "Candidate"
    skills: List[str] = []
    experiences_summary: Optional[str] = None


class CoverLetterResponse(BaseModel):
    cover_letter: str
    key_highlights: List[str] = []


# ------------------------------------------------------------------------------
# Advanced: LinkedIn Profile & Headline Optimizer
# ------------------------------------------------------------------------------
class LinkedInOptimizeRequest(BaseModel):
    target_role: str
    top_skills: List[str] = []
    years_experience: Optional[int] = 4
    current_headline: Optional[str] = None


class LinkedInOptimizeResponse(BaseModel):
    headlines: List[str]
    about_summary: str
    featured_skills: List[str]
