from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    headline: Optional[str] = None


class UserRead(UserBase):
    id: str
    linkedin_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    avatar_url: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class TokenPayload(BaseModel):
    sub: str
    email: str
    exp: int


class LinkedInAuthUrlResponse(BaseModel):
    auth_url: str
    state: str


class LinkedInCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None


class DemoLoginRequest(BaseModel):
    email: Optional[str] = "alex.developer@example.com"
    full_name: Optional[str] = "Alex Chen"
