from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.application import JobApplication
from app.models.user import User
from app.schemas.application import JobApplicationCreate, JobApplicationUpdate, JobApplicationRead
from app.api.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("", response_model=List[JobApplicationRead])
async def list_applications(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(JobApplication).where(JobApplication.user_id == current_user.id)
    if status_filter:
        query = query.where(JobApplication.status == status_filter)
    query = query.order_by(JobApplication.updated_at.desc())
    
    result = await db.execute(query)
    applications = result.scalars().all()
    return applications


@router.post("", response_model=JobApplicationRead, status_code=status.HTTP_201_CREATED)
async def create_application(
    payload: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    app_record = JobApplication(
        user_id=current_user.id,
        **payload.model_dump()
    )
    db.add(app_record)
    await db.commit()
    await db.refresh(app_record)
    return app_record


@router.put("/{app_id}", response_model=JobApplicationRead)
async def update_application(
    app_id: str,
    payload: JobApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(JobApplication).where(JobApplication.id == app_id, JobApplication.user_id == current_user.id)
    )
    app_record = result.scalar_one_or_none()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(app_record, field, val)

    await db.commit()
    await db.refresh(app_record)
    return app_record


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    app_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(JobApplication).where(JobApplication.id == app_id, JobApplication.user_id == current_user.id)
    )
    app_record = result.scalar_one_or_none()
    if not app_record:
        raise HTTPException(status_code=404, detail="Application not found")

    await db.delete(app_record)
    await db.commit()
    return None
