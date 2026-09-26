from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class JobApplicationBase(BaseModel):
    company: str
    role: str
    job_url: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    resume_id: Optional[str] = None
    resume_version_name: Optional[str] = None
    status: str = "saved"  # saved, applied, screening, interview, offer, rejected
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    job_url: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    resume_id: Optional[str] = None
    resume_version_name: Optional[str] = None
    status: Optional[str] = None
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationRead(JobApplicationBase):
    id: str
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
