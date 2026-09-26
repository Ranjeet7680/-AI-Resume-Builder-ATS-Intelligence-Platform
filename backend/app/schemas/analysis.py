from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.resume import ResumeBase


class ResumeHealthBreakdown(BaseModel):
    overall: int
    content: int
    ats_compatibility: int
    skills: int
    experience: int
    projects: int
    education: int
    formatting: int
    readability: int
    impact: int


class OverusedWordItem(BaseModel):
    word: str
    count: int
    severity: str  # "warning", "info"
    suggested_alternatives: List[str]


class KeywordIntelligence(BaseModel):
    present_keywords: List[str]
    missing_target_keywords: List[str]
    overused_words: List[OverusedWordItem]


class ExperienceAuditItem(BaseModel):
    exp_id: str
    title: str
    company: str
    bullet: str
    score: int
    has_action_verb: bool
    has_metric: bool
    detected_verb: Optional[str] = None
    issue: Optional[str] = None
    suggested_fix: Optional[str] = None


class TruthConsistencyIssue(BaseModel):
    text: str
    claim_type: str  # "metric", "revenue", "scale", "unsupported"
    flag_reason: str
    recommendation: str


class ResumeHealthReport(BaseModel):
    overall_score: int
    health: ResumeHealthBreakdown
    keyword_intel: KeywordIntelligence
    experience_audit: List[ExperienceAuditItem]
    truth_check: List[TruthConsistencyIssue]
    strong_points: List[str]
    critical_fixes: List[str]


class ResumeHealthRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    target_role: Optional[str] = "Software Engineer"
    target_job_description: Optional[str] = None


# ------------------------------------------------------------------------------
# Interview Prep Schemas
# ------------------------------------------------------------------------------
class InterviewQuestion(BaseModel):
    category: str  # "Technical", "Behavioral", "Project-Specific"
    question: str
    context_source: Optional[str] = None
    sample_answer_framework: str
    tips: str


class InterviewPrepRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    target_role: Optional[str] = "Software Engineer"
    job_description: Optional[str] = None


class InterviewPrepResponse(BaseModel):
    target_role: str
    technical_questions: List[InterviewQuestion]
    behavioral_questions: List[InterviewQuestion]
    project_questions: List[InterviewQuestion]


# ------------------------------------------------------------------------------
# Career Learning Roadmap Schemas
# ------------------------------------------------------------------------------
class RoadmapStep(BaseModel):
    step_number: int
    skill: str
    importance: str  # "Critical", "Recommended", "Bonus"
    why_needed: str
    learning_resources: List[str]
    portfolio_project_idea: str


class CareerRoadmapRequest(BaseModel):
    current_skills: List[str]
    target_role: str


class CareerRoadmapResponse(BaseModel):
    target_role: str
    current_skills: List[str]
    gap_skills: List[str]
    roadmap: List[RoadmapStep]
