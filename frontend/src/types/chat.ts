import { ResumeData } from "./resume";

export interface ChatActionCard {
  action_type: string;
  title: string;
  description: string;
  preview_data?: Record<string, any>;
  primary_cta: string;
  secondary_cta?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  language?: string;
  action_card?: ChatActionCard;
  isStreaming?: boolean;
}

export interface CareerChatbotRequest {
  messages: {
    id: string;
    role: string;
    content: string;
    timestamp: string;
  }[];
  resume_context?: Partial<ResumeData>;
  job_description?: string;
  target_role?: string;
  language?: string;
  interview_mode?: string;
  voice_enabled?: boolean;
}

export interface CareerChatbotResponse {
  reply: string;
  detected_language: string;
  language_name: string;
  is_hinglish: boolean;
  suggested_actions: string[];
  action_card?: ChatActionCard;
  suggested_questions: string[];
  audio_base64?: string;
}

export interface LanguageDetectResult {
  detected_language: string;
  language_name: string;
  is_indian_language: boolean;
  is_hinglish: boolean;
  script: string;
  confidence: number;
}

export interface InterviewStartResponse {
  session_id: string;
  target_role: string;
  interview_mode: string;
  question_index: number;
  total_questions: number;
  first_question: string;
  context_source: string;
  language: string;
  evaluation_criteria: string[];
}

export interface InterviewAnswerBreakdown {
  relevance: number;
  structure_star: number;
  clarity: number;
  completeness: number;
  technical_depth: number;
  filler_words_detected: string[];
}

export interface InterviewAnswerResponse {
  score: number;
  feedback: string;
  breakdown: InterviewAnswerBreakdown;
  strong_points: string[];
  improvement_tips: string[];
  next_question?: string | null;
  is_completed: boolean;
}

export interface InterviewEvaluateResponse {
  session_id: string;
  overall_score: number;
  readiness_level: string;
  radar_scores: Record<string, number>;
  top_strengths: string[];
  critical_growth_areas: string[];
  executive_summary: string;
}
