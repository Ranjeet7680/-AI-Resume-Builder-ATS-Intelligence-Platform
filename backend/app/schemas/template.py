from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.schemas.resume import ResumeBase


class TemplateCustomizationConfig(BaseModel):
    font_family: str = "Inter"  # Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Merriweather, Georgia
    color_theme: str = "#2563eb"  # Primary accent hex code
    layout_format: str = "single"  # single, two-column, compact, timeline
    font_size: str = "md"  # sm (9.5pt), md (10.5pt), lg (11.5pt)
    line_spacing: str = "normal"  # compact, normal, relaxed
    section_spacing: str = "normal"  # compact, normal, relaxed
    page_margin: str = "normal"  # narrow, normal, wide
    header_style: str = "left"  # left, center, banner
    show_photo: bool = False
    section_order: List[str] = Field(default_factory=lambda: ["summary", "experience", "projects", "skills", "education", "certifications"])


class TemplateMetadata(BaseModel):
    id: str
    name: str
    category: str  # ats, modern, tech, data_ai, student_fresher, executive, creative
    description: str
    ats_score: int  # 80-100 compatibility rating
    is_ats_guaranteed: bool
    preview_tag: str
    recommended_for: List[str]
    layout_default: str = "single"


class TemplateRecommendationRequest(BaseModel):
    target_role: Optional[str] = "Software Engineer"
    experience_level: Optional[str] = "experienced"  # fresher, experienced, executive, student
    industry: Optional[str] = "Technology"
    job_description: Optional[str] = None
    resume_data: Optional[ResumeBase] = None


class TemplateRecommendationItem(BaseModel):
    template_id: str
    template_name: str
    category: str
    match_score: int  # 0-100
    is_primary_recommendation: bool
    rationale: str
    key_advantages: List[str]


class TemplateRecommendationResponse(BaseModel):
    target_role: str
    experience_level: str
    recommended_templates: List[TemplateRecommendationItem]
    advice_summary: str


class Create5VersionsRequest(BaseModel):
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    target_role: Optional[str] = "Software Engineer"
    job_description: Optional[str] = None


class CreatedVersionItem(BaseModel):
    id: str
    version_name: str
    template_id: str
    purpose: str
    ats_score: int
    public_slug: Optional[str] = None
    download_urls: Dict[str, str]  # docx, pdf, txt, html, web


class Create5VersionsResponse(BaseModel):
    status: str
    total_versions: int
    message: str
    versions: List[CreatedVersionItem]
