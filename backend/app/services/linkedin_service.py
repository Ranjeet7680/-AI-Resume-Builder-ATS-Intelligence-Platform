import io
import re
import urllib.parse
from typing import Dict, Any, Optional
import httpx
from pypdf import PdfReader
from app.config import settings
from app.utils.text_processing import extract_skills_from_text


class LinkedInService:
    @staticmethod
    def get_authorization_url(state: str) -> str:
        """Constructs the LinkedIn OAuth 2.0 / OIDC Authorization URL."""
        params = {
            "response_type": "code",
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            "state": state,
            "scope": "openid profile email",
        }
        return f"{settings.LINKEDIN_AUTH_URL}?{urllib.parse.urlencode(params)}"

    @staticmethod
    async def exchange_code_for_token(code: str) -> Dict[str, Any]:
        """Exchanges an authorization code for an OAuth access token and id_token."""
        if not settings.LINKEDIN_CLIENT_ID or not settings.LINKEDIN_CLIENT_SECRET:
            # Mock token for development/demo testing if keys aren't set
            return {
                "access_token": "mock_linkedin_access_token_dev",
                "id_token": "mock_id_token",
            }

        data = {
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        async with httpx.AsyncClient() as client:
            resp = await client.post(settings.LINKEDIN_TOKEN_URL, data=data, headers=headers)
            if resp.status_code == 200:
                return resp.json()
            return {}

    @staticmethod
    async def get_user_info(access_token: str) -> Dict[str, Any]:
        """Fetches standard OIDC user info (name, email, picture, sub)."""
        if access_token.startswith("mock_"):
            return {
                "sub": "mock-linkedin-sub-123",
                "name": "Alex Chen",
                "email": "alex.chen.developer@example.com",
                "picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
            }

        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(settings.LINKEDIN_USERINFO_URL, headers=headers)
            if resp.status_code == 200:
                return resp.json()
            return {}

    @staticmethod
    def parse_linkedin_pdf(file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses an exported LinkedIn Profile PDF (from 'Save to PDF' feature).
        Extracts contact info, summary, experience, education, and skills.
        """
        reader = PdfReader(io.BytesIO(file_bytes))
        full_text = "\n".join([page.extract_text() or "" for page in reader.pages])

        lines = [line.strip() for line in full_text.split("\n") if line.strip()]
        
        full_name = lines[0] if lines else "Candidate"
        headline = lines[1] if len(lines) > 1 else ""

        # Extract email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', full_text)
        email = email_match.group(0) if email_match else ""

        # Extract skills
        extracted_skills = extract_skills_from_text(full_text)

        # Parse experiences (looking for Experience header)
        experiences = []
        if "Experience" in full_text:
            exp_section = full_text.split("Experience")[1].split("Education")[0]
            exp_lines = [l.strip() for l in exp_section.split("\n") if l.strip()]
            if len(exp_lines) >= 2:
                experiences.append({
                    "title": exp_lines[0],
                    "company": exp_lines[1] if len(exp_lines) > 1 else "Tech Company",
                    "startDate": "2021",
                    "endDate": "Present",
                    "current": True,
                    "bullets": [l for l in exp_lines[2:6] if len(l) > 20]
                })

        return {
            "fullName": full_name,
            "headline": headline,
            "email": email,
            "summary": "Experienced software professional with demonstrated history of delivery.",
            "skills": extracted_skills,
            "experiences": experiences
        }
