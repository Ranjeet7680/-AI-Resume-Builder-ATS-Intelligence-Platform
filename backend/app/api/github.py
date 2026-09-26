from fastapi import APIRouter, Depends
from app.schemas.github import GitHubAnalysisRequest, GitHubAnalysisResponse
from app.services.github_service import GitHubService

router = APIRouter(prefix="/github", tags=["GitHub Analyzer"])


@router.post("/analyze", response_model=GitHubAnalysisResponse)
async def analyze_github(payload: GitHubAnalysisRequest):
    return await GitHubService.analyze_profile(
        username_or_url=payload.username_or_url,
        target_role=payload.target_role or "Software Engineer"
    )
