import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db


@pytest.mark.asyncio
async def test_saas_full_flow():
    await init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Demo Login
        login_res = await client.post("/api/v1/auth/demo", json={"email": "career.pilot@example.com"})
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Profile & Onboarding
        profile_res = await client.get("/api/v1/profile", headers=headers)
        assert profile_res.status_code == 200
        data = profile_res.json()
        assert "completeness_score" in data

        onboard_res = await client.post(
            "/api/v1/profile/onboarding",
            headers=headers,
            json={
                "goal": "job_switch",
                "target_role": "Staff AI Engineer",
                "experience_level": "senior",
                "industry": "Artificial Intelligence & Cloud",
                "location_preference": "Remote / Bengaluru",
                "skills": ["Python", "PyTorch", "FastAPI", "Kubernetes", "LLMs"],
                "github_url": "https://github.com/alexchen"
            }
        )
        assert onboard_res.status_code == 200
        assert onboard_res.json()["status"] == "success"

        # 3. Application Tracker
        app_res = await client.post(
            "/api/v1/applications",
            headers=headers,
            json={
                "company": "Anthropic AI",
                "role": "Staff Platform Engineer",
                "status": "applied",
                "applied_date": "2026-09-26",
                "location": "San Francisco, CA / Remote",
                "salary_range": "$190k - $240k",
                "notes": "Referred via LinkedIn alumni network"
            }
        )
        assert app_res.status_code == 201
        created_app = app_res.json()
        app_id = created_app["id"]
        assert created_app["company"] == "Anthropic AI"

        list_apps = await client.get("/api/v1/applications", headers=headers)
        assert list_apps.status_code == 200
        assert len(list_apps.json()) >= 1

        # 4. Settings
        settings_res = await client.get("/api/v1/settings", headers=headers)
        assert settings_res.status_code == 200
        settings_data = settings_res.json()
        assert settings_data["theme"] in ["light", "dark", "system"]

        update_settings = await client.put(
            "/api/v1/settings",
            headers=headers,
            json={"theme": "dark", "language": "hi", "voice_speed": 1.15}
        )
        assert update_settings.status_code == 200
        assert update_settings.json()["language"] == "hi"

        # 5. GitHub Analyzer
        gh_res = await client.post(
            "/api/v1/github/analyze",
            json={"username_or_url": "https://github.com/alexchen", "target_role": "Software Engineer"}
        )
        assert gh_res.status_code == 200
        gh_data = gh_res.json()
        assert gh_data["username"] == "alexchen"
        assert len(gh_data["top_repositories"]) >= 1
        assert "suggested_bullets" in gh_data["top_repositories"][0]

        # 6. Admin & Campaigns
        admin_stats = await client.get("/api/v1/admin/stats")
        assert admin_stats.status_code == 200
        assert admin_stats.json()["total_users"] > 0

        campaigns = await client.get("/api/v1/admin/campaigns")
        assert campaigns.status_code == 200
        assert len(campaigns.json()) >= 1

        # 7. Career Analytics
        analytics_res = await client.get("/api/v1/analytics", headers=headers)
        assert analytics_res.status_code == 200
        analytics_data = analytics_res.json()
        assert "overview" in analytics_data
        assert "application_pipeline" in analytics_data
