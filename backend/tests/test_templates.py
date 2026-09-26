import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db


@pytest.mark.asyncio
async def test_template_studio_and_5_versions():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. List Templates
        r_list = await client.get("/templates")
        assert r_list.status_code == 200
        templates = r_list.json()
        assert len(templates) >= 15
        template_ids = [t["id"] for t in templates]
        assert "ats-minimal" in template_ids
        assert "software-engineer" in template_ids
        assert "ai-ml-engineer" in template_ids
        assert "fresher-classic" in template_ids
        assert "clean-executive" in template_ids

        # 2. Get Single Template
        r_single = await client.get("/templates/ai-ml-engineer")
        assert r_single.status_code == 200
        assert r_single.json()["category"] == "data_ai"
        assert r_single.json()["is_ats_guaranteed"] is True

        # 3. AI Template Recommendation for AI Engineer Fresher
        r_rec = await client.post("/templates/recommend", json={
            "target_role": "AI / ML Engineer",
            "experience_level": "fresher",
            "industry": "Artificial Intelligence",
            "job_description": "Seeking an AI/ML Engineer with PyTorch, vector embeddings, and LLM experience."
        })
        assert r_rec.status_code == 200
        rec_data = r_rec.json()
        assert len(rec_data["recommended_templates"]) == 3
        top_rec = rec_data["recommended_templates"][0]
        assert top_rec["is_primary_recommendation"] is True
        assert "fresher" in top_rec["template_id"] or "ai" in top_rec["template_id"]

        # 4. Auth for Create 5 Versions
        r_auth = await client.post("/api/v1/auth/demo", json={"full_name": "Ranjeet Kumar", "email": "ranjeet@example.com"})
        assert r_auth.status_code == 200
        token = r_auth.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 5. Create 5 Versions in One Click
        sample_resume = {
            "title": "Ranjeet Kumar Master Resume",
            "target_role": "AI Engineer",
            "template_id": "ats-minimal",
            "is_primary": True,
            "is_public": True,
            "personal_info": {
                "fullName": "Ranjeet Kumar",
                "headline": "AI & Software Engineer | PyTorch & Distributed Systems",
                "email": "ranjeet@example.com",
                "phone": "+91 98765 43210",
                "location": "Bengaluru, India",
                "website": "https://ranjeet.dev",
                "linkedin": "https://linkedin.com/in/ranjeetkumar",
                "github": "https://github.com/ranjeetkumar",
                "summary": "AI Engineer with experience deploying transformer models and building low-latency FastAPI inference microservices."
            },
            "experiences": [{
                "id": "exp-1",
                "company": "NeuralStack Labs",
                "role": "AI Engineer",
                "location": "Bengaluru, India",
                "startDate": "2022-06",
                "endDate": "Present",
                "current": True,
                "bullets": [
                    "Engineered vector retrieval pipeline utilizing pgvector, reducing similarity search latency by 45%.",
                    "Deployed production model serving endpoints handling 100k daily inference requests."
                ]
            }],
            "education": [{
                "id": "edu-1",
                "institution": "IIT Madras",
                "degree": "B.Tech",
                "fieldOfStudy": "Computer Science",
                "graduationYear": "2022"
            }],
            "skills": [
                {"category": "Machine Learning", "items": ["PyTorch", "Hugging Face", "LangChain", "pgvector"]},
                {"category": "Backend", "items": ["Python", "FastAPI", "PostgreSQL", "Docker"]}
            ],
            "projects": [{
                "id": "proj-1",
                "title": "Real-time AI Copilot",
                "description": "Multi-agent coding assistant built with FastAPI and local quantized models.",
                "bullets": ["Integrated streaming tokens with sub-40ms time-to-first-token."]
            }],
            "certifications": []
        }

        r_5ver = await client.post("/templates/create-5-versions", json={
            "resume_data": sample_resume,
            "target_role": "AI Engineer",
            "job_description": "Looking for an AI Engineer with PyTorch, FastAPI, and Docker experience."
        }, headers=headers)
        assert r_5ver.status_code == 200
        ver_data = r_5ver.json()
        assert ver_data["total_versions"] == 5
        assert len(ver_data["versions"]) == 5

        first_ver = ver_data["versions"][0]
        assert "docx" in first_ver["download_urls"]
        assert "txt" in first_ver["download_urls"]
        assert "web" in first_ver["download_urls"]

        # 6. Test TXT ATS Plain-Text Export
        ver_id = first_ver["id"]
        r_txt = await client.get(f"/api/v1/export/{ver_id}/txt", headers=headers)
        assert r_txt.status_code == 200
        assert "text/plain" in r_txt.headers["content-type"]
        assert "RANJEET KUMAR" in r_txt.text
        assert "PROFESSIONAL EXPERIENCE" in r_txt.text
        assert "TECHNICAL SKILLS" in r_txt.text
