from typing import List, Optional
from pydantic import BaseModel
from app.schemas.resume import ResumeBase


class ATSScoreBreakdown(BaseModel):
    overall: int
    keywords: int
    skills: int
    experience: int
    formatting: int
    achievements: int


class ATSAnalysisRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    target_role: Optional[str] = None
    job_description: Optional[str] = None


class ATSAnalysisResponse(BaseModel):
    overall_score: int
    breakdown: ATSScoreBreakdown
    matched_keywords: List[str]
    missing_keywords: List[str]
    action_verb_count: int
    metric_count: int
    formatting_issues: List[str]
    strong_points: List[str]
    suggestions: List[str]
