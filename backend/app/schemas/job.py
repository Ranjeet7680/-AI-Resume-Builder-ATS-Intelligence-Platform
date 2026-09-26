from typing import List, Optional
from pydantic import BaseModel
from app.schemas.resume import ResumeBase


class JobMatchRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    job_title: str
    company: Optional[str] = None
    job_description: str


class JobMatchResponse(BaseModel):
    job_title: str
    company: Optional[str] = None
    overall_match: int
    technical_match: int
    experience_match: int
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
