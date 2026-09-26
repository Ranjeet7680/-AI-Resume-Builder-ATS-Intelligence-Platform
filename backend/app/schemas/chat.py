from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.schemas.resume import ResumeBase


class ChatActionCard(BaseModel):
    action_type: str  # "improve_summary", "tailor_job", "analyze_ats", "skill_gaps", "cover_letter", "start_interview", "optimize_linkedin"
    title: str
    description: str
    preview_data: Dict[str, Any] = Field(default_factory=dict)
    primary_cta: str = "Accept & Apply"
    secondary_cta: Optional[str] = "Edit"


class ChatMessage(BaseModel):
    id: str
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: str
    language: Optional[str] = "en"
    action_card: Optional[ChatActionCard] = None


class CareerChatbotRequest(BaseModel):
    messages: List[ChatMessage]
    resume_context: Optional[Dict[str, Any]] = None
    job_description: Optional[str] = None
    target_role: Optional[str] = "Software Engineer"
    language: Optional[str] = "auto"
    interview_mode: Optional[str] = None
    voice_enabled: bool = False


class CareerChatbotResponse(BaseModel):
    reply: str
    detected_language: str
    language_name: str
    is_hinglish: bool = False
    suggested_actions: List[str] = Field(default_factory=list)
    action_card: Optional[ChatActionCard] = None
    audio_base64: Optional[str] = None
    suggested_questions: List[str] = Field(default_factory=list)


# ------------------------------------------------------------------------------
# Speech & Language Schemas
# ------------------------------------------------------------------------------
class TranscribeRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "auto"


class TranscribeResponse(BaseModel):
    text: str
    detected_language: str
    confidence: float = 0.95


class SynthesizeRequest(BaseModel):
    text: str
    language: str = "en"
    voice_id: Optional[str] = "default"
    speed: float = 1.0


class SynthesizeResponse(BaseModel):
    audio_base64: str
    content_type: str = "audio/wav"
    duration_seconds: float = 2.0


class LanguageDetectRequest(BaseModel):
    text: str


class LanguageDetectResponse(BaseModel):
    detected_language: str
    language_name: str
    is_indian_language: bool
    is_hinglish: bool
    script: str
    confidence: float


# ------------------------------------------------------------------------------
# Mock Interview Voice & Text Session Schemas
# ------------------------------------------------------------------------------
class InterviewStartRequest(BaseModel):
    target_role: str = "Software Engineer"
    interview_mode: str = "technical"  # "behavioral", "technical", "ai_ml", "data_science", "software_engineering", "system_design", "project_based"
    resume_id: Optional[str] = None
    resume_data: Optional[ResumeBase] = None
    job_description: Optional[str] = None
    language: str = "en"


class InterviewStartResponse(BaseModel):
    session_id: str
    target_role: str
    interview_mode: str
    question_index: int
    total_questions: int
    first_question: str
    context_source: str
    language: str
    evaluation_criteria: List[str]


class InterviewAnswerBreakdown(BaseModel):
    relevance: int
    structure_star: int
    clarity: int
    completeness: int
    technical_depth: int
    filler_words_detected: List[str] = Field(default_factory=list)


class InterviewAnswerRequest(BaseModel):
    session_id: str
    question: str
    answer_text: str
    interview_mode: str = "technical"
    target_role: str = "Software Engineer"
    question_index: int = 1
    total_questions: int = 5
    language: str = "en"
    resume_context: Optional[Dict[str, Any]] = None


class InterviewAnswerResponse(BaseModel):
    score: int
    feedback: str
    breakdown: InterviewAnswerBreakdown
    strong_points: List[str]
    improvement_tips: List[str]
    next_question: Optional[str] = None
    is_completed: bool = False


class InterviewEvaluateRequest(BaseModel):
    session_id: str
    target_role: str
    interview_mode: str
    qa_history: List[Dict[str, Any]]  # [{"question": ..., "answer": ..., "score": ...}]
    language: str = "en"


class InterviewEvaluateResponse(BaseModel):
    session_id: str
    overall_score: int
    readiness_level: str  # "Offer-Ready", "Strong Contender", "Needs Targeted Practice"
    radar_scores: Dict[str, int]
    top_strengths: List[str]
    critical_growth_areas: List[str]
    executive_summary: str
