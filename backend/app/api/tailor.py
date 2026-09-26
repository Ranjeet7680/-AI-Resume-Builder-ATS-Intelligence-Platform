import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeBase
from app.schemas.tailor import (
    JobAnalyzeRequest,
    JobAnalyzeResponse,
    TailorResumeRequest,
    TailorResumeResponse,
)
from app.services.tailor_service import tailor_service
from app.api.deps import get_current_user

router = APIRouter(tags=["AI Resume Tailor"])


@router.post("/jobs/analyze", response_model=JobAnalyzeResponse)
async def analyze_job_posting(payload: JobAnalyzeRequest):
    """
    Module 2: AI Job Analyzer.
    Extracts required skills, preferred skills, experience level,
    responsibilities, and keyword categories from raw job description text.
    """
    analysis = await tailor_service.analyze_job(
        job_description=payload.job_description,
        job_title=payload.job_title or "Software Engineer",
        company=payload.company
    )
    return analysis


@router.post("/resume/tailor", response_model=TailorResumeResponse)
async def tailor_resume_for_job(
    payload: TailorResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Flagship Feature: Paste Job Description -> AI Tailor My Resume.
    1. Analyzes job posting
    2. Identifies matching vs missing skills
    3. Re-aligns summary, highlights matching skills, and polishes bullets via XYZ formula
    4. Computes Before vs After ATS Score
    5. Saves as a dedicated job-specific resume version without overwriting the original!
    """
    resume_data = payload.resume_data

    if payload.resume_id:
        stmt = select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == current_user.id)
        res = await db.execute(stmt)
        saved_resume = res.scalar_one_or_none()
        if not saved_resume:
            raise HTTPException(status_code=404, detail="Base resume not found")

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

    # Run AI tailoring pipeline
    tailor_result = await tailor_service.tailor_resume(
        resume=resume_data,
        job_description=payload.job_description,
        job_title=payload.job_title,
        company=payload.company
    )

    saved_id = None
    if payload.save_as_new_version:
        # Create a new job-specific resume version
        version_title = payload.new_version_title or f"{resume_data.title} (Tailored for {payload.company or payload.job_title})"
        
        tailored_data = tailor_result["tailored_resume"]
        new_resume = Resume(
            user_id=current_user.id,
            title=version_title,
            target_role=payload.job_title,
            template_id=resume_data.template_id,
            personal_info=tailored_data["personal_info"],
            experiences=tailored_data["experiences"],
            education=tailored_data["education"],
            skills=tailored_data["skills"],
            projects=tailored_data["projects"],
            certifications=tailored_data["certifications"],
            ats_score=tailor_result["projected_ats_score"],
            is_primary=False,
            public_slug=f"tailored-{current_user.id[:6]}-{payload.job_title.lower().replace(' ', '-')[:16]}-{uuid.uuid4().hex[:6]}"
        )
        db.add(new_resume)
        await db.commit()
        await db.refresh(new_resume)
        saved_id = new_resume.id

    return {
        "job_title": payload.job_title,
        "company": payload.company,
        "original_ats_score": tailor_result["original_ats_score"],
        "projected_ats_score": tailor_result["projected_ats_score"],
        "matched_skills": tailor_result["matched_skills"],
        "missing_skills": tailor_result["missing_skills"],
        "diffs": tailor_result["diffs"],
        "tailored_resume": tailor_result["tailored_resume"],
        "saved_resume_id": saved_id
    }
