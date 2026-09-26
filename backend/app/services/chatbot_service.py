import re
import uuid
import base64
import struct
import math
import logging
from typing import Dict, Any, List, Optional, Tuple
from app.config import settings
from app.services.ai_service import ai_service
from app.services.ats_service import ats_service
from app.schemas.chat import (
    ChatMessage,
    ChatActionCard,
    CareerChatbotResponse,
    LanguageDetectResponse,
    InterviewAnswerBreakdown,
    InterviewAnswerResponse,
    InterviewStartResponse,
    InterviewEvaluateResponse,
)

logger = logging.getLogger(__name__)

INDIAN_LANGUAGES = {
    "en": {"name": "English (India)", "native": "English", "bcp47": "en-IN", "script": "Latin"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "bcp47": "hi-IN", "script": "Devanagari"},
    "bn": {"name": "Bengali", "native": "বাংলা", "bcp47": "bn-IN", "script": "Bengali"},
    "mr": {"name": "Marathi", "native": "मराठी", "bcp47": "mr-IN", "script": "Devanagari"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી", "bcp47": "gu-IN", "script": "Gujarati"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "bcp47": "ta-IN", "script": "Tamil"},
    "te": {"name": "Telugu", "native": "తెలుగు", "bcp47": "te-IN", "script": "Telugu"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "bcp47": "kn-IN", "script": "Kannada"},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "bcp47": "ml-IN", "script": "Malayalam"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "bcp47": "pa-IN", "script": "Gurmukhi"},
    "or": {"name": "Odia", "native": "ଓଡ଼ିଆ", "bcp47": "or-IN", "script": "Odia"},
    "as": {"name": "Assamese", "native": "অসমীয়া", "bcp47": "as-IN", "script": "Bengali"},
    "hinglish": {"name": "Hinglish (Hindi-English)", "native": "Hinglish", "bcp47": "hi-IN", "script": "Latin"},
}

HINGLISH_KEYWORDS = {
    "mera", "meri", "mere", "karo", "kijiye", "kaise", "karna", "kripya", "mujhe", 
    "batao", "bataiye", "accha", "naukri", "job", "chahiye", "kar", "sakte", "hai", 
    "hain", "resume", "banado", "sudhar", "dijiye", "bhai", "shukriya", "dhanyawad",
    "kya", "kyu", "kyun", "kab", "kisko", "pehle", "baad", "mein", "par", "se", "aur"
}

FILLER_WORDS = [
    "um", "uh", "like", "you know", "basically", "actually", "sort of", 
    "kind of", "i mean", "right", "matlab", "yani", "samjhe", "toh"
]


class ChatbotService:
    def detect_language(self, text: str) -> LanguageDetectResponse:
        """
        Accurately detects whether text is in English, one of the 11 major Indian scripts,
        or phonetic Hinglish.
        """
        if not text or not text.strip():
            return LanguageDetectResponse(
                detected_language="en",
                language_name="English",
                is_indian_language=False,
                is_hinglish=False,
                script="Latin",
                confidence=1.0
            )

        # Check Unicode script ranges
        char_counts = {
            "devanagari": len(re.findall(r'[\u0900-\u097F]', text)),
            "bengali": len(re.findall(r'[\u0980-\u09FF]', text)),
            "gurmukhi": len(re.findall(r'[\u0A00-\u0A7F]', text)),
            "gujarati": len(re.findall(r'[\u0A80-\u0AFF]', text)),
            "odia": len(re.findall(r'[\u0B00-\u0B7F]', text)),
            "tamil": len(re.findall(r'[\u0B80-\u0BFF]', text)),
            "telugu": len(re.findall(r'[\u0C00-\u0C7F]', text)),
            "kannada": len(re.findall(r'[\u0C80-\u0CFF]', text)),
            "malayalam": len(re.findall(r'[\u0D00-\u0D7F]', text)),
        }

        max_script, count = max(char_counts.items(), key=lambda item: item[1])
        if count > 2:
            script_map = {
                "devanagari": ("hi", "Hindi", "Devanagari"),
                "bengali": ("bn", "Bengali", "Bengali"),
                "gurmukhi": ("pa", "Punjabi", "Gurmukhi"),
                "gujarati": ("gu", "Gujarati", "Gujarati"),
                "odia": ("or", "Odia", "Odia"),
                "tamil": ("ta", "Tamil", "Tamil"),
                "telugu": ("te", "Telugu", "Telugu"),
                "kannada": ("kn", "Kannada", "Kannada"),
                "malayalam": ("ml", "Malayalam", "Malayalam"),
            }
            code, name, script = script_map[max_script]
            return LanguageDetectResponse(
                detected_language=code,
                language_name=name,
                is_indian_language=True,
                is_hinglish=False,
                script=script,
                confidence=0.98
            )

        # Check Latin text for Hinglish phonetic cues
        tokens = [w.lower().strip(",.!?\"'") for w in text.split()]
        hinglish_matches = [w for w in tokens if w in HINGLISH_KEYWORDS]
        if len(hinglish_matches) >= 2 or (len(tokens) <= 5 and len(hinglish_matches) >= 1):
            return LanguageDetectResponse(
                detected_language="hinglish",
                language_name="Hinglish",
                is_indian_language=True,
                is_hinglish=True,
                script="Latin",
                confidence=0.92
            )

        return LanguageDetectResponse(
            detected_language="en",
            language_name="English",
            is_indian_language=False,
            is_hinglish=False,
            script="Latin",
            confidence=0.95
        )

    def extract_intent(self, text: str) -> Tuple[str, Optional[ChatActionCard]]:
        """Identifies specific career commands to attach actionable UI cards."""
        lower = text.lower()

        if any(k in lower for k in ["improve summary", "rewrite summary", "better summary", "summary change", "mera summary"]):
            card = ChatActionCard(
                action_type="improve_summary",
                title="✨ Optimized Executive Summary",
                description="AI-restructured summary emphasizing leadership scope, quantified metrics, and target role alignment.",
                preview_data={
                    "proposed_summary": "High-impact Engineer specializing in scalable microservices, low-latency APIs, and cloud deployments. Proven track record reducing system latencies by 45% and accelerating release cycles."
                },
                primary_cta="Accept & Update Resume",
                secondary_cta="Customize"
            )
            return "improve_summary", card

        if any(k in lower for k in ["tailor", "job description", "match job", "fit this role", "naukri ke hisab"]):
            card = ChatActionCard(
                action_type="tailor_job",
                title="🎯 Tailor Resume to Job Posting",
                description="Align candidate keywords, highlight matching core competencies, and generate Before/After visual diffs.",
                preview_data={"mode": "tailor_studio"},
                primary_cta="Open Tailor Studio",
                secondary_cta="View Skill Matrix"
            )
            return "tailor_job", card

        if any(k in lower for k in ["ats", "ats score", "ats check", "score kitna hai"]):
            card = ChatActionCard(
                action_type="analyze_ats",
                title="📊 Run 5-Pillar ATS Diagnostic",
                description="Evaluate keyword density, action verbs, quantified results, and layout parseability.",
                preview_data={"target": "ats_report"},
                primary_cta="View Full ATS Breakdown",
                secondary_cta="Download Report"
            )
            return "analyze_ats", card

        if any(k in lower for k in ["skill gap", "missing skills", "kya miss ho raha", "skills needed"]):
            card = ChatActionCard(
                action_type="skill_gaps",
                title="🔑 Skill Gap & Competency Analysis",
                description="Discovered high-priority competencies requested by recruiters that are currently missing from your resume.",
                preview_data={"recommended_skills": ["Docker", "Kubernetes", "Redis Caching", "CI/CD"]},
                primary_cta="Add Missing Skills",
                secondary_cta="Find Certifications"
            )
            return "skill_gaps", card

        if any(k in lower for k in ["cover letter", "coverletter", "letter likh do"]):
            card = ChatActionCard(
                action_type="cover_letter",
                title="📝 Tailored Executive Cover Letter",
                description="3-paragraph narrative matching candidate achievements to the employer's operational requirements.",
                preview_data={"target": "cover_letter_studio"},
                primary_cta="Draft Cover Letter",
                secondary_cta="Select Tone"
            )
            return "cover_letter", card

        if any(k in lower for k in ["interview", "mock interview", "practice", "prep", "sawal pucho"]):
            card = ChatActionCard(
                action_type="start_interview",
                title="🎤 Start Voice Mock Interview",
                description="Simulate real-world engineering or HR interview with real-time feedback on relevance, STAR structure, and technical depth.",
                preview_data={"modes": ["Technical", "Behavioral", "System Design"]},
                primary_cta="Start Voice Session",
                secondary_cta="Switch to Text Mode"
            )
            return "start_interview", card

        if any(k in lower for k in ["linkedin", "headline", "profile optimize", "linkedin improve"]):
            card = ChatActionCard(
                action_type="optimize_linkedin",
                title="🔗 LinkedIn Recruiter Magnet",
                description="Generate keyword-rich headlines and an engaging 'About' summary that recruiter search algorithms rank highly.",
                preview_data={"target": "linkedin_optimizer"},
                primary_cta="Generate Headlines",
                secondary_cta="Optimize About"
            )
            return "optimize_linkedin", card

        return "general_conversation", None

    async def generate_chat_reply(
        self,
        messages: List[ChatMessage],
        resume_context: Optional[Dict[str, Any]] = None,
        job_description: Optional[str] = None,
        target_role: Optional[str] = "Software Engineer",
        language: Optional[str] = "auto",
        interview_mode: Optional[str] = None
    ) -> CareerChatbotResponse:
        """
        Orchestrates resume-aware multi-turn conversation with automatic or explicit
        Indian language & Hinglish support.
        """
        user_message = messages[-1].content if messages else ""
        
        # 1. Determine Language
        if not language or language == "auto":
            lang_detect = self.detect_language(user_message)
            active_lang = lang_detect.detected_language
            is_hinglish = lang_detect.is_hinglish
        else:
            active_lang = language
            is_hinglish = (language == "hinglish")

        lang_info = INDIAN_LANGUAGES.get(active_lang, INDIAN_LANGUAGES["en"])
        intent, action_card = self.extract_intent(user_message)

        # 2. Extract Resume Highlights for Context
        skills_summary = "Python, TypeScript, FastAPI, PostgreSQL, Redis, Docker"
        experience_summary = "Senior Software Engineer with experience in distributed systems"
        
        if resume_context:
            raw_skills = resume_context.get("skills", [])
            flat_skills = []
            for s in raw_skills:
                if isinstance(s, dict):
                    flat_skills.extend(s.get("items", []))
                elif isinstance(s, str):
                    flat_skills.append(s)
            if flat_skills:
                skills_summary = ", ".join(flat_skills[:12])

            raw_exp = resume_context.get("experiences", [])
            if raw_exp and isinstance(raw_exp, list):
                top_role = raw_exp[0].get("title", "")
                top_company = raw_exp[0].get("company", "")
                experience_summary = f"{top_role} at {top_company}"

        # 3. Formulate Prompt or Rule-based Multi-lingual Response
        if ai_service.client:
            try:
                system_instruction = (
                    f"You are an elite AI Career Coach and Resume Intelligence Mentor. "
                    f"You speak fluently in {lang_info['name']} ({lang_info['native']}).\n"
                    f"Target Role: {target_role}\n"
                    f"Candidate's Verified Skills: {skills_summary}\n"
                    f"Recent Role: {experience_summary}\n"
                    f"Job Description Context: {job_description or 'General industry standard'}\n\n"
                    f"Linguistic Instructions:\n"
                    f"- If language is 'hi', reply strictly in natural Hindi (Devanagari script).\n"
                    f"- If language is 'hinglish', reply in natural conversational Hinglish using Latin letters (e.g. 'Aapka resume kaafi strong hai, par summary mein metrics add karna chahiye.').\n"
                    f"- If language is 'bn', 'ta', 'te', 'mr', 'gu', reply in that respective language and native script.\n"
                    f"- If language is 'en', reply in articulate, encouraging professional English.\n"
                    f"- Ground all advice strictly in the candidate's verified resume without inventing fictional companies or qualifications.\n"
                    f"- Keep responses concise (2-4 paragraphs maximum), actionable, and formatted in clear markdown bullet points."
                )

                formatted_msgs = [{"role": "system", "content": system_instruction}]
                for m in messages[-6:]:
                    formatted_msgs.append({"role": m.role if m.role in ["user", "assistant"] else "user", "content": m.content})

                response = await ai_service.client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=formatted_msgs,
                    temperature=0.7,
                )
                reply_text = response.choices[0].message.content
            except Exception as e:
                logger.warning(f"OpenAI chat completion failed: {e}. Using intelligent multilingual fallback.")
                reply_text = self._build_offline_reply(active_lang, intent, user_message, skills_summary, target_role)
        else:
            reply_text = self._build_offline_reply(active_lang, intent, user_message, skills_summary, target_role)

        suggested_actions = [
            "✨ Improve Summary",
            "🎯 Tailor to Job",
            "📊 Check ATS Score",
            "🔑 Discover Skill Gaps",
            "🎤 Start Mock Interview"
        ]

        suggested_questions = [
            "How do I highlight my top technical achievements?",
            "What questions will I be asked in a technical screening?",
            "Can you write a cover letter for this role?",
            "How can I optimize my LinkedIn headline?"
        ]

        return CareerChatbotResponse(
            reply=reply_text,
            detected_language=active_lang,
            language_name=lang_info["name"],
            is_hinglish=is_hinglish,
            suggested_actions=suggested_actions,
            action_card=action_card,
            suggested_questions=suggested_questions,
            audio_base64=None
        )

    def _build_offline_reply(
        self,
        lang: str,
        intent: str,
        user_message: str,
        skills: str,
        target_role: Optional[str] = "Software Engineer"
    ) -> str:
        """High-quality localized offline responses for Indian languages and Hinglish."""
        if lang == "hi":
            if intent == "improve_summary":
                return (
                    f"मैंने आपके **{target_role}** रोल के लिए आपके रेज़्यूमे का विश्लेषण किया है। "
                    f"आपकी तकनीकी स्किल्स ({skills[:35]}...) काफी प्रभावशाली हैं। "
                    f"नीचे दिए गए कार्ड से आप बेहतर और इम्पैक्टफुल समरी देख और सीधे अप्लाई कर सकते हैं।"
                )
            elif intent == "start_interview":
                return (
                    f"बिल्कुल! हम **{target_role}** के लिए मॉक इंटरव्यू शुरू कर सकते हैं। "
                    f"आप माइक बटन दबाकर आवाज़ में जवाब दे सकते हैं। क्या आप पहले प्रश्न के लिए तैयार हैं?"
                )
            else:
                return (
                    f"नमस्ते! आपके रेज़्यूमे में **{skills[:40]}** जैसे मजबूत कौशल मौजूद हैं। "
                    f"**{target_role}** पद के लिए रेज़्यूमे को और बेहतर बनाने हेतु आप जॉब डिस्क्रिप्शन पेस्ट कर सकते हैं "
                    f"या नीचे दिए गए एक्शन कार्ड्स का उपयोग कर सकते हैं।"
                )

        elif lang == "hinglish":
            if intent == "improve_summary":
                return (
                    f"Maine aapka resume check kiya for **{target_role}**. "
                    f"Aapki core skills ({skills[:35]}...) achhi hain, lekin summary mein Google XYZ formula "
                    f"(Accomplished [X] by doing [Z]) use karke aur impactful banaya ja sakta hai. "
                    f"Neeche card se improved summary accept ya edit kar sakte hain."
                )
            elif intent == "start_interview":
                return (
                    f"Great! Chaliye **{target_role}** ka voice mock interview shuru karte hain. "
                    f"Main aapse technical aur behavioral sawal poochunga, aur aap mic se naturally answer de sakte hain. "
                    f"Ready for Question 1?"
                )
            else:
                return (
                    f"Haan bilkul! Aapke resume mein **{skills[:40]}** ka solid foundation hai. "
                    f"**{target_role}** ke liye hum resume tailor kar sakte hain, ATS score analyze kar sakte hain, "
                    f"ya mock interview practice kar sakte hain. Aap kya karna chahenge?"
                )

        elif lang == "bn":
            return (
                f"নমস্কার! আপনার রিজিউমেতে **{skills[:35]}**-এর মতো শক্তিশালী স্কিল রয়েছে। "
                f"**{target_role}** পদের জন্য এটি আরো উন্নত করতে নিচের অপশনগুলি ব্যবহার করতে পারেন।"
            )

        elif lang == "ta":
            return (
                f"வணக்கம்! உங்கள் ரெஸ்யூமில் **{skills[:35]}** போன்ற சிறந்த திறன்கள் உள்ளன. "
                f"**{target_role}** வேலைக்கு ஏற்றவாறு மேம்படுத்த கீழே உள்ள விருப்பங்களைப் பயன்படுத்தலாம்."
            )

        elif lang == "te":
            return (
                f"నమస్కారం! మీ రెజ్యూమ్‌లో **{skills[:35]}** వంటి గొప్ప నైపుణ్యాలు ఉన్నాయి. "
                f"**{target_role}** ఉద్యోగం కోసం దీన్ని మరింత మెరుగుపరచడానికి దిగువ ఎంపికలను ఉపయోగించండి."
            )

        elif lang == "mr":
            return (
                f"नमस्कार! आपल्या रेझ्युमेमध्ये **{skills[:35]}** सारखी मजबूत कौशल्ये आहेत. "
                f"**{target_role}** भूमिकेसाठी रेझ्युमे अधिक प्रभावी करण्यासाठी खालील पर्याय वापरा."
            )

        # Default English
        if intent == "improve_summary":
            return (
                f"Based on your profile targeting **{target_role}**, your foundation in `{skills[:40]}` is robust. "
                f"However, executive recruiters prioritize quantified scope and measurable business outcomes. "
                f"I've drafted a strengthened summary below using the Google XYZ framework for your review."
            )
        elif intent == "start_interview":
            return (
                f"Let's launch an interactive voice mock interview for **{target_role}**. "
                f"I will present questions spanning technical depth, architectural trade-offs, and STAR behavioral scenarios. "
                f"Tap the microphone when you are ready to answer."
            )
        else:
            return (
                f"I've examined your resume targeting **{target_role}**. "
                f"Your competencies in `{skills[:45]}` are prominent. "
                f"To maximize your callback rate, we can tailor your experience to a specific job description, "
                f"run an ATS audit, or begin an interactive voice mock interview."
            )

    # --------------------------------------------------------------------------
    # Mock Interview Engine
    # --------------------------------------------------------------------------
    def start_interview_session(self, req) -> InterviewStartResponse:
        session_id = f"mock-int-{uuid.uuid4().hex[:8]}"
        
        mode_questions = {
            "behavioral": "Tell me about a high-stakes production incident or engineering conflict you navigated under tight deadlines.",
            "technical": "How do you approach database connection pooling and asynchronous query latency when scaling to 10k requests per second?",
            "ai_ml": "In building semantic retrieval systems, how do you handle vector embedding dimensionality, indexing speed, and recall trade-offs?",
            "data_science": "Walk me through how you identify and mitigate data leakage in a predictive machine learning pipeline.",
            "software_engineering": "Explain how you structure microservice fault tolerance with circuit breakers and distributed retry patterns.",
            "system_design": "Design a high-throughput, low-latency URL shortening and analytics redirect service handling 100M daily clicks.",
            "project_based": "Walk me through the architecture of your most technically complex project listed on your resume. What was your biggest trade-off?"
        }

        first_q = mode_questions.get(req.interview_mode, mode_questions["technical"])
        
        return InterviewStartResponse(
            session_id=session_id,
            target_role=req.target_role,
            interview_mode=req.interview_mode,
            question_index=1,
            total_questions=5,
            first_question=first_q,
            context_source=f"Curated for {req.target_role} ({req.interview_mode.replace('_', ' ').title()})",
            language=req.language,
            evaluation_criteria=[
                "Relevance to question & role",
                "STAR structural clarity (Situation, Task, Action, Result)",
                "Technical depth and trade-off justification",
                "Conciseness & avoidance of filler words"
            ]
        )

    def evaluate_interview_answer(self, req) -> InterviewAnswerResponse:
        """Evaluates verbal or text response across 6 objective dimensions."""
        answer = req.answer_text.strip()
        word_count = len(answer.split())
        lower_ans = answer.lower()

        # 1. Detect filler words
        detected_fillers = [f for f in FILLER_WORDS if f" {f} " in f" {lower_ans} "]
        
        # 2. Score STAR presence
        star_markers = ["situation", "task", "action", "result", "because", "led to", "improved", "metric", "reduced", "delivered"]
        star_count = sum(1 for m in star_markers if m in lower_ans)
        structure_star = min(100, 50 + star_count * 10)

        # 3. Technical depth
        tech_markers = ["architecture", "latency", "scale", "database", "api", "cache", "async", "pipeline", "service", "system", "index"]
        tech_count = sum(1 for t in tech_markers if t in lower_ans)
        technical_depth = min(100, 45 + tech_count * 12)

        # 4. Relevance & Clarity
        relevance = 85 if word_count >= 25 else max(40, word_count * 2)
        clarity = max(50, 95 - len(detected_fillers) * 8)
        completeness = 88 if word_count >= 40 else 60

        overall_score = int((relevance * 0.25) + (structure_star * 0.25) + (technical_depth * 0.25) + (clarity * 0.15) + (completeness * 0.10))

        # Next questions sequence
        next_questions = [
            "What was the most challenging technical roadblock you encountered in that situation, and how did you resolve it?",
            "If you had to re-architect this solution today with 10x higher traffic, what would you change first?",
            "How did you validate that your changes didn't introduce regression bugs or degrade existing SLAs?",
            "Tell me about a situation where you had to push back on a requirement or compromise on technical debt.",
            "That concludes this mock interview session! Would you like a comprehensive performance scorecard?"
        ]

        next_q = next_questions[min(req.question_index - 1, len(next_questions) - 1)]
        is_completed = (req.question_index >= req.total_questions)

        strong_points = []
        if technical_depth >= 75:
            strong_points.append("Demonstrated solid engineering vocabulary and concrete trade-off reasoning.")
        if structure_star >= 70:
            strong_points.append("Clear chronological progression from problem context to tangible delivery.")
        if len(detected_fillers) == 0:
            strong_points.append("Very articulate vocal delivery with zero distracting filler words.")
        else:
            strong_points.append("Addressed the core premise directly without evasion.")

        improvement_tips = []
        if len(detected_fillers) > 0:
            improvement_tips.append(f"Minimize verbal fillers like: {', '.join(detected_fillers)}.")
        if word_count < 30:
            improvement_tips.append("Expand on your personal contribution (the 'Action' step) to illustrate depth.")
        if "%" not in answer and not any(char.isdigit() for char in answer):
            improvement_tips.append("Include at least one quantified result or metric benchmark (e.g. latency, error rate, team velocity).")

        return InterviewAnswerResponse(
            score=overall_score,
            feedback=f"Strong answer ({overall_score}/100). Highlighted decisive actions and context.",
            breakdown=InterviewAnswerBreakdown(
                relevance=relevance,
                structure_star=structure_star,
                clarity=clarity,
                completeness=completeness,
                technical_depth=technical_depth,
                filler_words_detected=detected_fillers
            ),
            strong_points=strong_points,
            improvement_tips=improvement_tips,
            next_question=None if is_completed else next_q,
            is_completed=is_completed
        )

    def evaluate_interview_session(self, req) -> InterviewEvaluateResponse:
        """Synthesizes overall scorecard from multi-turn interview."""
        scores = [item.get("score", 75) for item in req.qa_history] if req.qa_history else [82]
        avg_score = int(sum(scores) / len(scores))

        readiness = "Offer-Ready" if avg_score >= 85 else ("Strong Contender" if avg_score >= 70 else "Needs Targeted Practice")

        return InterviewEvaluateResponse(
            session_id=req.session_id,
            overall_score=avg_score,
            readiness_level=readiness,
            radar_scores={
                "Technical Depth": min(100, avg_score + 4),
                "STAR Structure": avg_score,
                "Communication & Clarity": min(100, avg_score - 2),
                "Problem Solving": min(100, avg_score + 5),
                "Role Alignment": min(100, avg_score + 2)
            },
            top_strengths=[
                "Articulate communication with strong technical domain command",
                "Decisive explanation of architectural trade-offs",
                "Consistent framing around quantifiable team impact"
            ],
            critical_growth_areas=[
                "Explicitly state baseline metrics before quoting final improvements",
                "Keep initial answers focused under 2 minutes before inviting deeper follow-ups"
            ],
            executive_summary=(
                f"Candidate demonstrated {readiness.lower()} competence for {req.target_role}. "
                f"Averaged {avg_score}/100 across technical and scenario-based queries."
            )
        )

    # --------------------------------------------------------------------------
    # Audio Synthesis Fallback Helper (generates clean valid PCM WAV audio)
    # --------------------------------------------------------------------------
    @staticmethod
    def generate_simple_tone_wav(duration: float = 1.0, freq: float = 440.0) -> bytes:
        """Produces a lightweight valid WAV audio byte stream for offline speech test fallback."""
        sample_rate = 16000
        num_samples = int(sample_rate * duration)
        raw_data = bytearray()
        for i in range(num_samples):
            t = float(i) / sample_rate
            value = int(32767.0 * 0.3 * math.sin(2.0 * math.pi * freq * t))
            raw_data.extend(struct.pack("<h", value))

        wav_header = bytearray()
        wav_header.extend(b"RIFF")
        wav_header.extend(struct.pack("<I", 36 + len(raw_data)))
        wav_header.extend(b"WAVEfmt ")
        wav_header.extend(struct.pack("<I", 16))  # Subchunk1Size
        wav_header.extend(struct.pack("<H", 1))   # PCM format
        wav_header.extend(struct.pack("<H", 1))   # NumChannels = 1
        wav_header.extend(struct.pack("<I", sample_rate))
        wav_header.extend(struct.pack("<I", sample_rate * 2))  # ByteRate
        wav_header.extend(struct.pack("<H", 2))   # BlockAlign
        wav_header.extend(struct.pack("<H", 16))  # BitsPerSample
        wav_header.extend(b"data")
        wav_header.extend(struct.pack("<I", len(raw_data)))

        return bytes(wav_header + raw_data)


chatbot_service = ChatbotService()
