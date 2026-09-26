from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.resume import ResumeBase


class JobAnalyzeRequest(BaseModel):
    job_description: str
    job_title: Optional[str] = "Software Engineer"
    company: Optional[str] = None


class JobAnalyzeResponse(BaseModel):
    job_title: str
    company: Optional[str] = None
    experience_level: str
    required_skills: List[str]
    preferred_skills: List[str]
    keywords: List[str]
    skill_categories: Dict[str, List[str]]
    responsibilities: List[str]


class TailoredSectionDiff(BaseModel):
    section: str  # "summary", "experience", "skills", "projects"
    title: str
    before: Any
    after: Any
    explanation: str


class TailorResumeRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    job_description: str
    job_title: Optional[str] = "Software Engineer"
    company: Optional[str] = None
    save_as_new_version: bool = True
    new_version_title: Optional[str] = None


class TailorResumeResponse(BaseModel):
    job_title: str
    company: Optional[str] = None
    original_ats_score: int
    projected_ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    diffs: List[TailoredSectionDiff]
    tailored_resume: ResumeBase
    saved_resume_id: Optional[str] = None
