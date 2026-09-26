import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db

@pytest.mark.asyncio
async def test_smoke_endpoints():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        r_health = await client.get("/healthz")
        assert r_health.status_code == 200
        assert r_health.json() == {"status": "healthy"}

        # 2. Demo Auth login
        r_auth = await client.post("/api/v1/auth/demo", json={"full_name": "Alex Rivera", "email": "alex@example.com"})
        assert r_auth.status_code == 200
        token = r_auth.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create resume
        sample_resume = {
            "title": "Senior Full-Stack Engineer Resume",
            "target_role": "Senior Full-Stack Engineer",
            "template_id": "modern-ats",
            "is_primary": True,
            "is_public": True,
            "personal_info": {
                "fullName": "Alex Rivera",
                "headline": "Senior Full-Stack Engineer | Distributed Systems",
                "email": "alex@example.com",
                "phone": "+1 555 123 4567",
                "location": "San Francisco, CA",
                "website": "https://alexrivera.dev",
                "linkedin": "https://linkedin.com/in/alexrivera",
                "github": "https://github.com/alexrivera",
                "summary": "Senior Full-Stack Engineer with 6+ years specializing in Python, FastAPI, React, and cloud scalability."
            },
            "experiences": [{
                "id": "exp-1",
                "company": "TechNova Solutions",
                "role": "Senior Software Engineer",
                "location": "San Francisco, CA",
                "startDate": "2021-03",
                "endDate": "Present",
                "current": True,
                "bullets": [
                    "Architected distributed microservices handling 250k daily active users.",
                    "Engineered real-time telemetry processing pipeline reducing latency by 45%."
                ]
            }],
            "education": [{
                "id": "edu-1",
                "institution": "UC Berkeley",
                "degree": "B.S.",
                "fieldOfStudy": "Computer Science",
                "graduationYear": "2020"
            }],
            "skills": [
                {"category": "Backend", "items": ["Python", "FastAPI", "PostgreSQL", "Redis"]},
                {"category": "Frontend", "items": ["TypeScript", "React", "Next.js", "Tailwind CSS"]}
            ],
            "projects": [{
                "id": "proj-1",
                "title": "Vector Search Pipeline",
                "description": "Built semantic retrieval pipeline using pgvector and FastAPI.",
                "bullets": ["Indexed 1M document embeddings with sub-20ms P99 latency."]
            }],
            "certifications": []
        }
        r_resume = await client.post("/api/v1/resume", json=sample_resume, headers=headers)
        assert r_resume.status_code in [200, 201]
        resume_data = r_resume.json()
        resume_id = resume_data["id"]
        slug = resume_data.get("public_slug") or resume_id

        # 4. Analyze Health
        r_health_diag = await client.post("/api/v1/resume/analyze-health", json={"resume_data": sample_resume})
        assert r_health_diag.status_code == 200
        health_data = r_health_diag.json()
        assert "overall_score" in health_data
        assert "health" in health_data
        assert "keyword_intel" in health_data
        assert "truth_check" in health_data

        # 5. Tailor for Job
        sample_jd = "Seeking a Senior Full-Stack Engineer skilled in Python, FastAPI, Redis, AWS, and Next.js."
        r_tailor = await client.post("/api/v1/resume/tailor", json={
            "resume_data": sample_resume,
            "job_description": sample_jd,
            "job_title": "Senior Full-Stack Engineer"
        }, headers=headers)
        assert r_tailor.status_code == 200
        tailor_data = r_tailor.json()
        assert "tailored_resume" in tailor_data
        assert "diffs" in tailor_data

        # 6. Public share route
        r_public = await client.get(f"/api/v1/resume/public/{slug}")
        assert r_public.status_code == 200
        assert r_public.json()["view_count"] >= 1

        # 7. Document Exports
        r_docx = await client.get(f"/api/v1/export/{resume_id}/docx", headers=headers)
        assert r_docx.status_code == 200
        assert len(r_docx.content) > 1000

        r_html = await client.get(f"/api/v1/export/{resume_id}/html", headers=headers)
        assert r_html.status_code == 200
        assert "<html" in r_html.text.lower()

        r_json = await client.get(f"/api/v1/export/{resume_id}/json", headers=headers)
        assert r_json.status_code == 200
        assert "basics" in r_json.json()
        assert r_json.json()["basics"]["fullName"] == sample_resume["personal_info"]["fullName"]

        # 8. AI Interview Prep
        r_prep = await client.post("/api/v1/interview/prep", json={
            "resume_data": sample_resume,
            "target_role": "Senior Full-Stack Engineer"
        })
        assert r_prep.status_code == 200
        prep_data = r_prep.json()
        assert "technical_questions" in prep_data
        assert "behavioral_questions" in prep_data
        assert "project_questions" in prep_data

if __name__ == "__main__":
    asyncio.run(test_smoke_endpoints())
    print("ALL 6 ENDPOINT SMOKE TESTS PASSED!")
