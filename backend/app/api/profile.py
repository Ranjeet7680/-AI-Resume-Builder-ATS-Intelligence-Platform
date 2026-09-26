from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.profile import OnboardingRequest, UserProfileUpdate, UserProfileResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile & Onboarding"])


@router.get("", response_model=UserProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    missing_sections = []
    if not current_user.headline:
        missing_sections.append("Professional Headline")
    if not current_user.summary:
        missing_sections.append("Career Summary")
    if not current_user.avatar_url:
        missing_sections.append("Profile Photo")

    completeness = 100 - (len(missing_sections) * 15)

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name or "Alex Chen",
        headline=current_user.headline or "Senior Full Stack & AI Engineer",
        avatar_url=current_user.avatar_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        summary=current_user.summary or "Impact-driven software engineer architecting distributed systems and production LLM workflows.",
        completeness_score=max(completeness, 70),
        missing_sections=missing_sections,
        has_completed_onboarding=True
    )


@router.put("", response_model=UserProfileResponse)
async def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.headline is not None:
        current_user.headline = payload.headline
    if payload.summary is not None:
        current_user.summary = payload.summary
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url

    await db.commit()
    await db.refresh(current_user)

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        headline=current_user.headline,
        avatar_url=current_user.avatar_url,
        summary=current_user.summary,
        completeness_score=88,
        missing_sections=[],
        has_completed_onboarding=True
    )


@router.post("/onboarding")
async def complete_onboarding(
    payload: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Update headline and target career direction
    current_user.headline = f"{payload.target_role} ({payload.industry})"
    current_user.summary = f"Career Goal: {payload.goal.replace('_', ' ').title()}. Specializing in {', '.join(payload.skills[:5])}."
    
    await db.commit()
    await db.refresh(current_user)

    return {
        "status": "success",
        "message": "Onboarding completed successfully! Your AI career workspace is configured.",
        "user_id": current_user.id,
        "target_role": payload.target_role,
        "goal": payload.goal
    }
