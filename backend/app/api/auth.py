import uuid
import secrets
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    Token,
    UserRead,
    LinkedInAuthUrlResponse,
    LinkedInCallbackRequest,
    DemoLoginRequest,
)
from app.services.linkedin_service import LinkedInService
from app.utils.security import create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/linkedin")
async def linkedin_direct_login():
    """
    Direct browser redirection to LinkedIn OAuth 2.0 / OIDC login screen.
    Uses openid, profile, and email scopes.
    """
    state = secrets.token_urlsafe(32)
    auth_url = LinkedInService.get_authorization_url(state=state)
    return RedirectResponse(auth_url)


@router.get("/linkedin/callback")
async def linkedin_callback_redirect(
    code: str,
    state: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Handles browser redirection callback from LinkedIn.
    Exchanges authorization code for access_token & id_token,
    provisions or syncs user profile, issues JWT, and redirects to frontend.
    """
    token_data = await LinkedInService.exchange_code_for_token(code)
    access_token = token_data.get("access_token")

    if not access_token:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=linkedin_auth_failed")

    user_info = await LinkedInService.get_user_info(access_token)
    email = user_info.get("email") or f"user_{uuid.uuid4().hex[:8]}@linkedin.com"

    # Find or create user
    stmt = select(User).where(User.email == email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        user = User(
            email=email,
            full_name=user_info.get("name", "LinkedIn Member"),
            avatar_url=user_info.get("picture"),
            linkedin_id=user_info.get("sub"),
            linkedin_access_token=access_token,
        )
        db.add(user)
    else:
        user.linkedin_id = user_info.get("sub", user.linkedin_id)
        user.avatar_url = user_info.get("picture", user.avatar_url)
        user.linkedin_access_token = access_token

    await db.commit()
    await db.refresh(user)

    jwt_token = create_access_token(data={"sub": user.id, "email": user.email})
    return RedirectResponse(f"{settings.FRONTEND_URL}/auth/callback?token={jwt_token}")


@router.get("/linkedin/url", response_model=LinkedInAuthUrlResponse)
async def get_linkedin_login_url():
    """Generates the LinkedIn OAuth 2.0 / OIDC login redirection URL for SPAs."""
    state = secrets.token_urlsafe(32)
    url = LinkedInService.get_authorization_url(state=state)
    return {"auth_url": url, "state": state}


@router.post("/linkedin/callback", response_model=Token)
async def linkedin_callback_json(
    payload: LinkedInCallbackRequest,
    db: AsyncSession = Depends(get_db)
):
    """JSON API endpoint for SPAs exchanging LinkedIn authorization code."""
    token_data = await LinkedInService.exchange_code_for_token(payload.code)
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to authenticate with LinkedIn."
        )

    user_info = await LinkedInService.get_user_info(access_token)
    email = user_info.get("email") or f"user_{uuid.uuid4().hex[:8]}@linkedin.com"

    # Find or create user
    stmt = select(User).where(User.email == email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        user = User(
            email=email,
            full_name=user_info.get("name", "LinkedIn Member"),
            avatar_url=user_info.get("picture"),
            linkedin_id=user_info.get("sub"),
            linkedin_access_token=access_token,
        )
        db.add(user)
    else:
        user.linkedin_id = user_info.get("sub", user.linkedin_id)
        user.avatar_url = user_info.get("picture", user.avatar_url)
        user.linkedin_access_token = access_token

    await db.commit()
    await db.refresh(user)

    jwt_token = create_access_token(data={"sub": user.id, "email": user.email})
    return {"access_token": jwt_token, "token_type": "bearer", "user": user}


@router.post("/demo", response_model=Token)
async def demo_login(
    payload: DemoLoginRequest = DemoLoginRequest(),
    db: AsyncSession = Depends(get_db)
):
    """Provides a 1-click demo login for seamless evaluation and sandbox testing."""
    stmt = select(User).where(User.email == payload.email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        user = User(
            email=payload.email,
            full_name=payload.full_name,
            headline="Full Stack & AI Engineer",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    jwt_token = create_access_token(data={"sub": user.id, "email": user.email})
    return {"access_token": jwt_token, "token_type": "bearer", "user": user}


@router.post("/import-linkedin-pdf")
async def import_linkedin_pdf(file: UploadFile = File(...)):
    """
    Solves LinkedIn's OIDC API scope limitation by parsing a downloaded
    LinkedIn Profile PDF ('More' -> 'Save to PDF') into structured resume data.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    content = await file.read()
    parsed_data = LinkedInService.parse_linkedin_pdf(content)
    return {"status": "success", "data": parsed_data}


@router.get("/me", response_model=UserRead)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user's profile."""
    return current_user
