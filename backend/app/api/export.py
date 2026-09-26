from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeBase
from app.services.export_service import export_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/{resume_id}/html", response_class=HTMLResponse)
async def export_resume_html(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Renders pixel-perfect HTML preview suitable for printing or PDF capture."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_data = ResumeBase(
        title=resume.title,
        target_role=resume.target_role,
        template_id=resume.template_id,
        personal_info=resume.personal_info,
        experiences=resume.experiences,
        education=resume.education,
        skills=resume.skills,
        projects=resume.projects,
        certifications=resume.certifications,
    )
    html_content = export_service.render_html(resume_data)
    return HTMLResponse(content=html_content)


@router.get("/{resume_id}/docx")
async def export_resume_docx(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates and downloads a Microsoft Word (.docx) document."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_data = ResumeBase(
        title=resume.title,
        target_role=resume.target_role,
        template_id=resume.template_id,
        personal_info=resume.personal_info,
        experiences=resume.experiences,
        education=resume.education,
        skills=resume.skills,
        projects=resume.projects,
        certifications=resume.certifications,
    )
    docx_bytes = export_service.generate_docx(resume_data)
    
    filename = f"{resume.personal_info.get('fullName', 'Resume').replace(' ', '_')}_Resume.docx"
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/{resume_id}/json")
async def export_resume_json(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Exports standardized JSON Resume format for open data interoperability."""
    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "basics": resume.personal_info,
        "work": resume.experiences,
        "education": resume.education,
        "skills": resume.skills,
        "projects": resume.projects,
        "certificates": resume.certifications,
        "meta": {
            "version": "v1.0.0",
            "lastModified": resume.updated_at.isoformat()
        }
    }


@router.get("/{resume_id}/txt", response_class=Response)
async def export_resume_txt(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates clean ASCII Plain-Text (TXT) optimized for automated ATS copy-paste."""
    from app.services.template_service import template_service

    stmt = select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    res = await db.execute(stmt)
    resume = res.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_data = ResumeBase(
        title=resume.title,
        target_role=resume.target_role,
        template_id=resume.template_id,
        personal_info=resume.personal_info,
        experiences=resume.experiences,
        education=resume.education,
        skills=resume.skills,
        projects=resume.projects,
        certifications=resume.certifications,
    )
    plain_text = template_service.generate_plain_text(resume_data)
    filename = f"{resume.personal_info.get('fullName', 'resume').replace(' ', '_')}_ATS.txt"

    return Response(
        content=plain_text,
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

