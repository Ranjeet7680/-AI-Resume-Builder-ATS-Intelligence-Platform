from typing import List, Optional
from pydantic import BaseModel, Field


class GitHubRepoAnalysis(BaseModel):
    name: str
    description: Optional[str] = ""
    language: Optional[str] = ""
    stars: int = 0
    forks: int = 0
    topics: List[str] = Field(default_factory=list)
    suggested_resume_project_title: str
    suggested_bullets: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)


class GitHubAnalysisRequest(BaseModel):
    username_or_url: str
    target_role: Optional[str] = "Software Engineer"


class GitHubAnalysisResponse(BaseModel):
    username: str
    total_repos_analyzed: int
    primary_languages: List[str]
    top_repositories: List[GitHubRepoAnalysis]
    extracted_technical_skills: List[str]
    portfolio_quality_rating: int = 88
    strategic_recommendations: List[str] = Field(default_factory=list)
