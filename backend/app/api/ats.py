from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.resume import Resume
from app.models.ats import ATSReport
from app.schemas.ats import ATSAnalysisRequest, ATSAnalysisResponse
from app.schemas.resume import ResumeBase
from app.services.ats_service import ats_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ats", tags=["ATS Engine"])


@router.post("/analyze", response_model=ATSAnalysisResponse)
async def analyze_ats_score(
    payload: ATSAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Computes ATS compatibility score and actionable suggestions for a resume.
    Can be run either on a saved resume ID or on live editor resume payload.
    """
    resume_data = payload.resume_data

    if payload.resume_id:
        stmt = select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == current_user.id)
        res = await db.execute(stmt)
        saved_resume = res.scalar_one_or_none()
        if not saved_resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        resume_data = ResumeBase(
            title=saved_resume.title,
            target_role=saved_resume.target_role,
            template_id=saved_resume.template_id,
            personal_info=saved_resume.personal_info,
            experiences=saved_resume.experiences,
            education=saved_resume.education,
            skills=saved_resume.skills,
            projects=saved_resume.projects,
            certifications=saved_resume.certifications,
        )

    if not resume_data:
        raise HTTPException(status_code=400, detail="Must provide either resume_id or resume_data")

    analysis = ats_service.analyze_resume(
        resume=resume_data,
        target_role=payload.target_role or resume_data.target_role,
        job_description=payload.job_description
    )

    # Persist ATS report if resume_id is provided
    if payload.resume_id:
        report = ATSReport(
            resume_id=payload.resume_id,
            overall_score=analysis["overall_score"],
            keywords_score=analysis["breakdown"]["keywords"],
            skills_score=analysis["breakdown"]["skills"],
            experience_score=analysis["breakdown"]["experience"],
            formatting_score=analysis["breakdown"]["formatting"],
            achievements_score=analysis["breakdown"]["achievements"],
            missing_keywords=analysis["missing_keywords"],
            strong_points=analysis["strong_points"],
            suggestions=analysis["suggestions"],
        )
        db.add(report)

        # Update cached score on resume
        stmt = select(Resume).where(Resume.id == payload.resume_id)
        res = await db.execute(stmt)
        r = res.scalar_one_or_none()
        if r:
            r.ats_score = analysis["overall_score"]

        await db.commit()

    return analysis
