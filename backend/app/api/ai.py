from fastapi import APIRouter
from app.schemas.ai import (
    ImproveBulletRequest,
    ImproveBulletResponse,
    GenerateSummaryRequest,
    GenerateSummaryResponse,
    ExtractSkillsRequest,
    ExtractSkillsResponse,
    StarBuilderRequest,
    StarBuilderResponse,
    CareerChatRequest,
    CareerChatResponse,
    CoverLetterRequest,
    CoverLetterResponse,
    LinkedInOptimizeRequest,
    LinkedInOptimizeResponse,
)
from app.services.ai_service import ai_service
from app.utils.text_processing import extract_skills_from_text

router = APIRouter(prefix="/ai", tags=["AI Engine"])


@router.post("/improve-bullet", response_model=ImproveBulletResponse)
async def improve_bullet(payload: ImproveBulletRequest):
    """
    Transforms informal bullet points into high-impact XYZ achievements
    while strictly preserving factual veracity.
    """
    result = await ai_service.improve_bullet(
        text=payload.text,
        target_role=payload.target_role,
        tone=payload.tone
    )
    return result


@router.post("/generate-summary", response_model=GenerateSummaryResponse)
async def generate_summary(payload: GenerateSummaryRequest):
    """Generates an executive recruiter-optimized summary tailored to a target role."""
    result = await ai_service.generate_summary(
        target_role=payload.target_role,
        years_of_experience=payload.years_of_experience or 3,
        skills=payload.skills,
        highlights=payload.highlights
    )
    return result


@router.post("/extract-skills", response_model=ExtractSkillsResponse)
async def extract_skills(payload: ExtractSkillsRequest):
    """Extracts technical skills and categorizes them."""
    skills = extract_skills_from_text(payload.text)
    return {
        "technical_skills": skills,
        "tools_frameworks": [s for s in skills if s in ["docker", "kubernetes", "git", "github actions"]],
        "soft_skills": ["Team Leadership", "Cross-functional Collaboration", "System Architecture"]
    }


@router.post("/star-builder", response_model=StarBuilderResponse)
async def build_star_achievement(payload: StarBuilderRequest):
    """
    Module 8 & 9: Guided STAR experience and project builder.
    Transforms Situation, Task, Action, and Result into an executive resume bullet.
    """
    result = await ai_service.build_star_bullet(
        role=payload.role,
        task_challenge=payload.task_challenge,
        technology=payload.technology,
        action_taken=payload.action_taken,
        result_metric=payload.result_metric
    )
    return result


@router.post("/career-chat", response_model=CareerChatResponse)
async def career_chat(payload: CareerChatRequest):
    """
    Module 16: Interactive AI Career Mentor.
    Answers resume questions, identifies blind spots, and prepares candidates for interviews.
    """
    messages_dict = [{"role": m.role, "content": m.content} for m in payload.messages]
    result = await ai_service.career_chat(
        messages=messages_dict,
        target_role=payload.target_role,
        resume_context=payload.resume_context
    )
    return result


@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(payload: CoverLetterRequest):
    """
    Advanced Feature: Generates a tailored 3-paragraph executive cover letter
    matching the target company's job description.
    """
    result = await ai_service.generate_cover_letter(
        job_title=payload.job_title,
        company=payload.company,
        job_description=payload.job_description,
        candidate_name=payload.candidate_name or "Candidate",
        skills=payload.skills,
        experiences_summary=payload.experiences_summary
    )
    return result


@router.post("/optimize-linkedin", response_model=LinkedInOptimizeResponse)
async def optimize_linkedin(payload: LinkedInOptimizeRequest):
    """
    Advanced Feature: Generates recruiter-magnetic LinkedIn headlines and About summary.
    """
    result = await ai_service.optimize_linkedin_profile(
        target_role=payload.target_role,
        top_skills=payload.top_skills,
        years_experience=payload.years_experience or 4,
        current_headline=payload.current_headline
    )
    return result
