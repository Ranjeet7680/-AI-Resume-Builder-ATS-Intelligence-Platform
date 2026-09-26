import uuid
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    fullName: str = ""
    headline: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    website: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    summary: str = ""


class ExperienceItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    company: str = ""
    location: Optional[str] = ""
    startDate: str = ""
    endDate: Optional[str] = ""
    current: bool = False
    bullets: List[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution: str = ""
    degree: str = ""
    fieldOfStudy: Optional[str] = ""
    startDate: str = ""
    endDate: Optional[str] = ""
    gpa: Optional[str] = ""
    highlights: List[str] = Field(default_factory=list)


class SkillCategory(BaseModel):
    category: str = "Technical Skills"
    items: List[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    link: Optional[str] = ""
    bullets: List[str] = Field(default_factory=list)


class CertificationItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    issuer: str = ""
    issueDate: Optional[str] = ""
    url: Optional[str] = ""


class ResumeBase(BaseModel):
    title: str = "Software Engineer Resume"
    target_role: Optional[str] = "Software Engineer"
    template_id: str = "modern-ats"
    public_slug: Optional[str] = None
    is_public: bool = True
    personal_info: PersonalInfo = Field(default_factory=PersonalInfo)
    experiences: List[ExperienceItem] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    skills: List[SkillCategory] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_role: Optional[str] = None
    template_id: Optional[str] = None
    public_slug: Optional[str] = None
    is_public: Optional[bool] = None
    personal_info: Optional[PersonalInfo] = None
    experiences: Optional[List[ExperienceItem]] = None
    education: Optional[List[EducationItem]] = None
    skills: Optional[List[SkillCategory]] = None
    projects: Optional[List[ProjectItem]] = None
    certifications: Optional[List[CertificationItem]] = None
    ats_score: Optional[int] = None


class ResumeRead(ResumeBase):
    id: str
    user_id: str
    ats_score: int = 0
    is_primary: bool = False
    view_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
