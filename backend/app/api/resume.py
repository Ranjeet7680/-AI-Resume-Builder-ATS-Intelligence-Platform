from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    ResumeRead,
)
from app.api.deps import get_current_user
from app.services.ats_service import ats_service

router = APIRouter(prefix="/resume", tags=["Resumes"])


@router.get("", response_model=List[ResumeRead])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves all resumes belonging to the authenticated user."""
    stmt = select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.updated_at.desc())
    res = await db.execute(stmt)
    resumes = res.scalars().all()
    
    # If user has no resumes yet, initialize a sample one
    if not resumes:
        sample_resume = Resume(
            user_id=current_user.id,
            title="Senior Full Stack Engineer Resume",
            target_role="Senior Full Stack Engineer",
            template_id="modern-ats",
            personal_info={
                "fullName": current_user.full_name or "Alex Chen",
                "headline": current_user.headline or "Senior Full Stack & AI Engineer",
                "email": current_user.email,
                "phone": "+1 (555) 234-5678",
                "location": "San Francisco, CA",
                "website": "https://alexchen.dev",
                "linkedin": "https://linkedin.com/in/alexchen",
                "github": "https://github.com/alexchen",
                "summary": "High-impact Full Stack and AI Engineer with 5+ years of experience architecting distributed cloud systems, modern React frontends, and production LLM pipelines. Proven ability to reduce latency by 45% and lead high-velocity product squads."
            },
            experiences=[
                {
                    "id": "exp-1",
                    "title": "Senior Software Engineer",
                    "company": "ScaleAI Dynamics",
                    "location": "San Francisco, CA",
                    "startDate": "2022-03",
                    "endDate": "Present",
                    "current": True,
                    "bullets": [
                        "Architected distributed microservices handling 45M+ daily requests using FastAPI, Redis, and PostgreSQL.",
                        "Optimized database query performance and index strategies, reducing p99 API response latencies from 320ms to 48ms.",
                        "Spearheaded adoption of automated CI/CD deployment pipelines on Kubernetes, accelerating release velocity by 65%."
                    ]
                },
                {
                    "id": "exp-2",
                    "title": "Full Stack Developer",
                    "company": "Nexus Web Systems",
                    "location": "New York, NY",
                    "startDate": "2020-01",
                    "endDate": "2022-02",
                    "current": False,
                    "bullets": [
                        "Engineered modular React & TypeScript design system utilized by 20+ software engineers across 4 business units.",
                        "Implemented secure OAuth 2.0 and role-based access control protecting confidential customer records."
                    ]
                }
            ],
            education=[
                {
                    "id": "edu-1",
                    "institution": "University of California, Berkeley",
                    "degree": "B.S. in Computer Science",
                    "fieldOfStudy": "Software Systems & Machine Learning",
                    "startDate": "2016",
                    "endDate": "2020",
                    "gpa": "3.85",
                    "highlights": ["Dean's Honor List", "President of Open Source Developers Club"]
                }
            ],
            skills=[
                {
                    "category": "Languages & Frameworks",
                    "items": ["Python", "TypeScript", "FastAPI", "React", "Next.js", "Node.js", "SQL"]
                },
                {
                    "category": "Cloud & Infrastructure",
                    "items": ["Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis", "GitHub Actions"]
                }
            ],
            projects=[
                {
                    "id": "proj-1",
                    "title": "Real-time Vector Search Engine",
                    "description": "High-throughput semantic similarity search service leveraging pgvector and FastAPI.",
                    "technologies": ["Python", "pgvector", "FastAPI", "Docker"],
                    "link": "https://github.com/alexchen/vector-search",
                    "bullets": [
                        "Benchmarked sub-15ms vector retrieval across 2M document embeddings with 99.4% recall."
                    ]
                }
            ],
            certifications=[
                {
                    "id": "cert-1",
                    "name": "AWS Certified Solutions Architect - Associate",
                    "issuer": "Amazon Web Services",
                    "issueDate": "2023",
                    "url": "https://aws.amazon.com/certification"
                }
            ],
            ats_score=88
        )
        db.add(sample_resume)
        await db.commit()
        await db.refresh(sample_resume)
        resumes = [sample_resume]

    return resumes


@router.post("", response_model=ResumeRead, status_code=status.HTTP_201_CREATED)
async def create_resume(
    payload: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Creates a new resume for the current user."""
    # Compute baseline ATS score
    analysis = ats_service.analyze_resume(payload, target_role=payload.target_role)

    resume = Resume(
        user_id=current_user.id,
        title=payload.title,
        target_role=payload.target_role,
        template_id=payload.template_id,
        personal_info=payload.personal_info.model_dump(),
        experiences=[e.model_dump() for e in payload.experiences],
        education=[e.model_dump() for e in payload.education],
        skills=[s.model_dump() for s in payload.skills],
        projects=[p.model_dump() for p in payload.projects],
        certifications=[c.model_dump() for c in payload.certifications],
        ats_score=analysis["overall_score"]
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


@router.get("/{resume_id}", response_model=ResumeRead)
async def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves a specific resume by ID."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.put("/{resume_id}", response_model=ResumeRead)
async def update_resume(
    resume_id: str,
    payload: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Updates an existing resume."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if payload.title is not None:
        resume.title = payload.title
    if payload.target_role is not None:
        resume.target_role = payload.target_role
    if payload.template_id is not None:
        resume.template_id = payload.template_id
    if payload.personal_info is not None:
        resume.personal_info = payload.personal_info.model_dump()
    if payload.experiences is not None:
        resume.experiences = [e.model_dump() for e in payload.experiences]
    if payload.education is not None:
        resume.education = [e.model_dump() for e in payload.education]
    if payload.skills is not None:
        resume.skills = [s.model_dump() for s in payload.skills]
    if payload.projects is not None:
        resume.projects = [p.model_dump() for p in payload.projects]
    if payload.certifications is not None:
        resume.certifications = [c.model_dump() for c in payload.certifications]
    if payload.public_slug is not None:
        resume.public_slug = payload.public_slug
    if payload.is_public is not None:
        resume.is_public = payload.is_public

    await db.commit()
    await db.refresh(resume)
    return resume


@router.get("/public/{slug_or_id}", response_model=ResumeRead)
async def get_public_resume(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Module 14: Public Shareable Resume View.
    Retrieves public resume by its custom slug or unique ID and increments view count.
    No authentication required.
    """
    stmt = select(Resume).where(
        (Resume.public_slug == slug_or_id) | (Resume.id == slug_or_id),
        Resume.is_public == True
    )
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Public resume not found or made private")

    # Increment view analytics
    resume.view_count += 1
    await db.commit()
    await db.refresh(resume)

    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletes a resume."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    await db.delete(resume)
    await db.commit()
    return None
