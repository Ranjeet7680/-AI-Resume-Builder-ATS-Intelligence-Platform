import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db


@pytest.mark.asyncio
async def test_chat_and_voice_endpoints():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Supported languages list
        r_langs = await client.get("/language/supported")
        assert r_langs.status_code == 200
        langs_data = r_langs.json()["languages"]
        assert "hi" in langs_data
        assert "hinglish" in langs_data
        assert "bn" in langs_data
        assert "ta" in langs_data
        assert "te" in langs_data
        assert "mr" in langs_data

        # 2. Language Detection
        r_detect_hi = await client.post("/language/detect", json={"text": "मेरा resume improve करो"})
        assert r_detect_hi.status_code == 200
        assert r_detect_hi.json()["detected_language"] == "hi"
        assert r_detect_hi.json()["is_indian_language"] is True

        r_detect_hinglish = await client.post("/language/detect", json={"text": "Mera resume AI engineer job ke liye improve kar do"})
        assert r_detect_hinglish.status_code == 200
        assert r_detect_hinglish.json()["detected_language"] == "hinglish"
        assert r_detect_hinglish.json()["is_hinglish"] is True

        r_detect_bn = await client.post("/language/detect", json={"text": "আমার রেজুমে উন্নত করুন"})
        assert r_detect_bn.status_code == 200
        assert r_detect_bn.json()["detected_language"] == "bn"

        # 3. Chat Message in Hinglish with Resume Context & Action Card Detection
        sample_resume_context = {
            "target_role": "AI Engineer",
            "skills": [{"items": ["Python", "PyTorch", "FastAPI", "PostgreSQL"]}],
            "experiences": [{"title": "Machine Learning Engineer", "company": "NeuralDynamics"}]
        }
        r_chat_hinglish = await client.post("/chat/message", json={
            "messages": [
                {"id": "msg-1", "role": "user", "content": "Mera summary improve kar do", "timestamp": "2026-09-26T12:00:00Z"}
            ],
            "resume_context": sample_resume_context,
            "target_role": "AI Engineer",
            "language": "auto"
        })
        assert r_chat_hinglish.status_code == 200
        data_chat = r_chat_hinglish.json()
        assert data_chat["detected_language"] == "hinglish"
        assert data_chat["is_hinglish"] is True
        assert data_chat["action_card"] is not None
        assert data_chat["action_card"]["action_type"] == "improve_summary"

        # 4. Voice-to-Voice endpoint (audio returned)
        r_voice = await client.post("/chat/voice", json={
            "messages": [
                {"id": "msg-2", "role": "user", "content": "Tell me about my resume strengths", "timestamp": "2026-09-26T12:00:00Z"}
            ],
            "resume_context": sample_resume_context,
            "target_role": "AI Engineer",
            "language": "en"
        })
        assert r_voice.status_code == 200
        assert r_voice.json()["audio_base64"] is not None

        # 5. Speech Synthesize & Transcribe
        r_synth = await client.post("/speech/synthesize", json={
            "text": "Your resume has strong technical projects.",
            "language": "en",
            "speed": 1.0
        })
        assert r_synth.status_code == 200
        assert len(r_synth.json()["audio_base64"]) > 50

        r_trans = await client.post("/speech/transcribe", json={
            "audio_base64": r_synth.json()["audio_base64"],
            "language": "en"
        })
        assert r_trans.status_code == 200
        assert len(r_trans.json()["text"]) > 0

        # 6. Interactive Mock Interview Flow
        r_int_start = await client.post("/interview/start", json={
            "target_role": "Senior AI Engineer",
            "interview_mode": "ai_ml",
            "language": "en"
        })
        assert r_int_start.status_code == 200
        int_session = r_int_start.json()
        session_id = int_session["session_id"]
        assert len(int_session["first_question"]) > 10

        # 7. Answer Mock Interview Question
        sample_answer = (
            "In our vector search pipeline, the situation was latency spiking under high QPS. "
            "My task was to optimize pgvector retrieval. I implemented HNSW indexing with partial quantization, "
            "which led to reducing p99 query latency from 85ms to 14ms."
        )
        r_int_ans = await client.post("/interview/answer", json={
            "session_id": session_id,
            "question": int_session["first_question"],
            "answer_text": sample_answer,
            "interview_mode": "ai_ml",
            "target_role": "Senior AI Engineer",
            "question_index": 1,
            "total_questions": 3,
            "language": "en"
        })
        assert r_int_ans.status_code == 200
        ans_data = r_int_ans.json()
        assert ans_data["score"] >= 70
        assert ans_data["breakdown"]["structure_star"] >= 70
        assert ans_data["breakdown"]["technical_depth"] >= 70

        # 8. Evaluate Interview Session
        r_int_eval = await client.post("/interview/evaluate", json={
            "session_id": session_id,
            "target_role": "Senior AI Engineer",
            "interview_mode": "ai_ml",
            "qa_history": [
                {"question": int_session["first_question"], "answer": sample_answer, "score": ans_data["score"]}
            ],
            "language": "en"
        })
        assert r_int_eval.status_code == 200
        eval_data = r_int_eval.json()
        assert "overall_score" in eval_data
        assert "readiness_level" in eval_data
        assert "radar_scores" in eval_data

        # 9. Privacy Wipe Chat History
        r_del = await client.delete("/chat/history?session_id=default")
        assert r_del.status_code == 200
        assert r_del.json()["status"] == "success"
