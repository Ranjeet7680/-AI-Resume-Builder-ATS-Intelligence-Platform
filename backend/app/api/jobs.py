from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobMatch
from app.schemas.job import JobMatchRequest, JobMatchResponse
from app.schemas.resume import ResumeBase
from app.api.deps import get_current_user
from app.utils.text_processing import extract_skills_from_text

router = APIRouter(prefix="/jobs", tags=["Job Matcher"])


@router.post("/match", response_model=JobMatchResponse)
async def match_resume_with_job(
    payload: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Compares resume against target job description.
    Produces Technical Match %, Skill Gap Analysis, and Tailoring Recommendations.
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

    # Extract required skills from job description
    job_skills = set(extract_skills_from_text(payload.job_description))
    if not job_skills:
        job_skills = {"python", "sql", "git", "docker"}

    # Extract all candidate skills
    resume_skills = set()
    for cat in resume_data.skills:
        for s in cat.items:
            resume_skills.add(s.strip().lower())
    for exp in resume_data.experiences:
        for b in exp.bullets:
            for s in extract_skills_from_text(b):
                resume_skills.add(s)

    matched_skills = sorted(list(job_skills.intersection(resume_skills)))
    missing_skills = sorted(list(job_skills.difference(resume_skills)))

    # Compute match metrics
    tech_match = int(len(matched_skills) / max(len(job_skills), 1) * 100)
    exp_match = min(len(resume_data.experiences) * 35 + 20, 95)
    overall_match = int((tech_match * 0.6) + (exp_match * 0.4))

    # Recommendations
    recommendations = []
    if missing_skills:
        recommendations.append(f"Consider highlighting experience with {', '.join(missing_skills[:3])} in your projects or summary.")
    if len(resume_data.experiences) < 2:
        recommendations.append("Add more comprehensive project details to demonstrate domain mastery.")
    recommendations.append("Tailor your summary section to echo the core mission outlined in the job description.")

    # Save to history if resume_id is known
    if payload.resume_id:
        match_record = JobMatch(
            user_id=current_user.id,
            resume_id=payload.resume_id,
            job_title=payload.job_title,
            company=payload.company,
            job_description=payload.job_description,
            overall_match=overall_match,
            technical_match=tech_match,
            experience_match=exp_match,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            recommendations=recommendations,
        )
        db.add(match_record)
        await db.commit()

    return {
        "job_title": payload.job_title,
        "company": payload.company,
        "overall_match": overall_match,
        "technical_match": tech_match,
        "experience_match": exp_match,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": recommendations,
    }
