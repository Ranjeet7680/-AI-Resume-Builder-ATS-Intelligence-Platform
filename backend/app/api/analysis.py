from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeBase
from app.schemas.analysis import (
    ResumeHealthRequest,
    ResumeHealthReport,
    InterviewPrepRequest,
    InterviewPrepResponse,
    CareerRoadmapRequest,
    CareerRoadmapResponse,
)
from app.services.analysis_service import analysis_service
from app.api.deps import get_current_user

router = APIRouter(tags=["Resume Health & Intelligence"])


@router.post("/resume/analyze-health", response_model=ResumeHealthReport)
async def get_resume_health_report(
    payload: ResumeHealthRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Module 1: 360° Resume Health Diagnosis.
    Evaluates 9 health dimensions (Content, ATS, Skills, Experience, Projects,
    Education, Formatting, Readability, Impact), performs Keyword Intelligence,
    audits experience bullets, and runs truth/consistency validation.
    """
    resume_data = payload.resume_data

    if payload.resume_id:
        stmt = select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == current_user.id)
        res = await db.execute(stmt)
        saved = res.scalar_one_or_none()
        if not saved:
            raise HTTPException(status_code=404, detail="Resume not found")

        resume_data = ResumeBase(
            title=saved.title,
            target_role=saved.target_role,
            template_id=saved.template_id,
            personal_info=saved.personal_info,
            experiences=saved.experiences,
            education=saved.education,
            skills=saved.skills,
            projects=saved.projects,
            certifications=saved.certifications,
        )

    if not resume_data:
        raise HTTPException(status_code=400, detail="Must provide either resume_id or resume_data")

    report = analysis_service.analyze_resume_health(
        resume=resume_data,
        target_role=payload.target_role or resume_data.target_role,
        target_job_description=payload.target_job_description
    )
    return report


@router.post("/resume/upload-and-analyze", response_model=ResumeHealthReport)
async def upload_resume_and_analyze(
    file: UploadFile = File(...),
    target_role: str = "Software Engineer"
):
    """
    Direct File Upload & Instant 360° Health Diagnosis.
    Accepts PDF or DOCX resume document, extracts text and structure,
    and returns a complete diagnostic report.
    """
    if not (file.filename.lower().endswith(".pdf") or file.filename.lower().endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    file_bytes = await file.read()
    parsed_resume = analysis_service.parse_uploaded_resume(file_bytes, file.filename)
    report = analysis_service.analyze_resume_health(parsed_resume, target_role=target_role)
    return report


@router.post("/interview/prep", response_model=InterviewPrepResponse)
async def generate_interview_prep(
    payload: InterviewPrepRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Module 16: AI Interview Preparation.
    Generates targeted technical questions, STAR-method behavioral questions,
    and project architecture questions derived directly from the candidate's resume.
    """
    resume_data = payload.resume_data

    if payload.resume_id:
        stmt = select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == current_user.id)
        res = await db.execute(stmt)
        saved = res.scalar_one_or_none()
        if saved:
            resume_data = ResumeBase(
                title=saved.title,
                target_role=saved.target_role,
                template_id=saved.template_id,
                personal_info=saved.personal_info,
                experiences=saved.experiences,
                education=saved.education,
                skills=saved.skills,
                projects=saved.projects,
                certifications=saved.certifications,
            )

    if not resume_data:
        raise HTTPException(status_code=400, detail="Must provide either resume_id or resume_data")

    prep = analysis_service.generate_interview_prep(
        resume=resume_data,
        target_role=payload.target_role or resume_data.target_role,
        job_description=payload.job_description
    )
    return prep


@router.post("/career/roadmap", response_model=CareerRoadmapResponse)
async def get_career_learning_roadmap(payload: CareerRoadmapRequest):
    """
    Module 25: Career Learning Roadmap.
    Identifies exact skill gaps for the target role and provides a structured,
    step-by-step roadmap with portfolio project ideas.
    """
    roadmap = analysis_service.generate_career_roadmap(
        current_skills=payload.current_skills,
        target_role=payload.target_role
    )
    return roadmap
