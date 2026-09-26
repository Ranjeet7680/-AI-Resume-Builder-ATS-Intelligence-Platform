import { ResumeData, ATSAnalysis, JobMatchResult, UserProfile } from "@/types/resume";
import {
  TemplateMetadata,
  TemplateRecommendationRequest,
  TemplateRecommendationResponse,
  Create5VersionsRequest,
  Create5VersionsResponse,
} from "@/types/template";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("resume_auth_token");
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("resume_auth_token", token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("resume_auth_token");
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(errorBody.detail || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Authentication API
export const authApi = {
  getLinkedInUrl: () => apiRequest<{ auth_url: string; state: string }>("/auth/linkedin/url"),
  exchangeLinkedInCode: (code: string, state?: string) =>
    apiRequest<{ access_token: string; user: UserProfile }>("/auth/linkedin/callback", {
      method: "POST",
      body: JSON.stringify({ code, state }),
    }),
  demoLogin: (email?: string) =>
    apiRequest<{ access_token: string; user: UserProfile }>("/auth/demo", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  getMe: () => apiRequest<UserProfile>("/auth/me"),
  uploadLinkedInPdf: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/auth/import-linkedin-pdf`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },
};

// Resumes API
export const resumeApi = {
  list: () => apiRequest<ResumeData[]>("/resume"),
  get: (id: string) => apiRequest<ResumeData>(`/resume/${id}`),
  create: (data: Partial<ResumeData>) =>
    apiRequest<ResumeData>("/resume", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ResumeData>) =>
    apiRequest<ResumeData>(`/resume/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/resume/${id}`, {
      method: "DELETE",
    }),
  getPublic: (slugOrId: string) => apiRequest<ResumeData>(`/resume/public/${slugOrId}`),
};

// AI Engine API
export const aiApi = {
  improveBullet: (text: string, target_role?: string, tone?: string) =>
    apiRequest<{
      original_text: string;
      improved_text: string;
      alternatives: string[];
      action_verb_used: string;
      rationale: string;
    }>("/ai/improve-bullet", {
      method: "POST",
      body: JSON.stringify({ text, target_role, tone }),
    }),
  generateSummary: (target_role: string, years?: number, skills?: string[], highlights?: string) =>
    apiRequest<{ summary: string; alternatives: string[] }>("/ai/generate-summary", {
      method: "POST",
      body: JSON.stringify({ target_role, years_of_experience: years, skills, highlights }),
    }),
  extractSkills: (text: string) =>
    apiRequest<{ technical_skills: string[]; tools_frameworks: string[]; soft_skills: string[] }>(
      "/ai/extract-skills",
      {
        method: "POST",
        body: JSON.stringify({ text }),
      }
    ),
  starBuilder: (payload: {
    role: string;
    task_challenge: string;
    technology: string;
    action_taken: string;
    result_metric?: string;
  }) =>
    apiRequest<{
      bullet_point: string;
      action_verb: string;
      alternative: string;
      rationale: string;
    }>("/ai/star-builder", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  careerChat: (payload: {
    messages: { role: string; content: string }[];
    target_role?: string;
    resume_context?: string;
  }) =>
    apiRequest<{
      reply: string;
      suggested_actions: string[];
    }>("/ai/career-chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  generateCoverLetter: (payload: {
    job_title: string;
    company: string;
    job_description: string;
    candidate_name?: string;
    skills?: string[];
    experiences_summary?: string;
  }) =>
    apiRequest<{
      cover_letter: string;
      key_highlights: string[];
    }>("/ai/generate-cover-letter", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  optimizeLinkedIn: (payload: {
    target_role: string;
    top_skills?: string[];
    years_experience?: number;
    current_headline?: string;
  }) =>
    apiRequest<{
      headlines: string[];
      about_summary: string;
      featured_skills: string[];
    }>("/ai/optimize-linkedin", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ATS & Job Match API
export const atsApi = {
  analyze: (payload: { resume_id?: string; resume_data?: Partial<ResumeData>; target_role?: string; job_description?: string }) =>
    apiRequest<ATSAnalysis>("/ats/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const jobsApi = {
  match: (payload: { resume_id?: string; resume_data?: Partial<ResumeData>; job_title: string; company?: string; job_description: string }) =>
    apiRequest<JobMatchResult>("/jobs/match", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const exportApi = {
  getHtmlExportUrl: (resumeId: string) => `${API_BASE}/export/${resumeId}/html`,
  getDocxExportUrl: (resumeId: string) => `${API_BASE}/export/${resumeId}/docx`,
  getJsonExportUrl: (resumeId: string) => `${API_BASE}/export/${resumeId}/json`,
  getTxtExportUrl: (resumeId: string) => `${API_BASE}/export/${resumeId}/txt`,
};

// AI Tailor API
export const tailorApi = {
  analyzeJob: (payload: { job_description: string; job_title?: string; company?: string }) =>
    apiRequest<any>("/jobs/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  tailorResume: (payload: {
    resume_id?: string;
    resume_data?: Partial<ResumeData>;
    job_description: string;
    job_title: string;
    company?: string;
    save_as_new_version?: boolean;
    new_version_title?: string;
  }) =>
    apiRequest<any>("/resume/tailor", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Resume Health, Interview Prep & Career Roadmap API
export const analysisApi = {
  analyzeHealth: (payload: {
    resume_id?: string;
    resume_data?: Partial<ResumeData>;
    target_role?: string;
    target_job_description?: string;
  }) =>
    apiRequest<any>("/resume/analyze-health", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  uploadAndAnalyze: async (file: File, target_role: string = "Software Engineer") => {
    const formData = new FormData();
    formData.append("file", file);
    const token = getAuthToken();
    const response = await fetch(`${API_BASE}/resume/upload-and-analyze?target_role=${encodeURIComponent(target_role)}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to parse uploaded document");
    }
    return response.json();
  },
  generateInterviewPrep: (payload: {
    resume_id?: string;
    resume_data?: Partial<ResumeData>;
    target_role?: string;
    job_description?: string;
  }) =>
    apiRequest<any>("/interview/prep", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getCareerRoadmap: (payload: { current_skills: string[]; target_role: string }) =>
    apiRequest<any>("/career/roadmap", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// AI Career Chatbot & Voice API
export const chatApi = {
  sendMessage: (payload: any) =>
    apiRequest<any>("/chat/message", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  sendVoice: (payload: any) =>
    apiRequest<any>("/chat/voice", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  transcribeAudio: (audio_base64: string, language?: string) =>
    apiRequest<{ text: string; detected_language: string; confidence: number }>("/speech/transcribe", {
      method: "POST",
      body: JSON.stringify({ audio_base64, language }),
    }),

  synthesizeSpeech: (text: string, language: string = "en", speed: number = 1.0) =>
    apiRequest<{ audio_base64: string; content_type: string; duration_seconds: number }>("/speech/synthesize", {
      method: "POST",
      body: JSON.stringify({ text, language, speed }),
    }),

  detectLanguage: (text: string) =>
    apiRequest<{
      detected_language: string;
      language_name: string;
      is_indian_language: boolean;
      is_hinglish: boolean;
      script: string;
      confidence: number;
    }>("/language/detect", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  getSupportedLanguages: () =>
    apiRequest<{ languages: Record<string, { name: string; native: string; bcp47: string; script: string }> }>("/language/supported"),

  startInterview: (payload: {
    target_role: string;
    interview_mode: string;
    resume_id?: string;
    resume_data?: any;
    job_description?: string;
    language?: string;
  }) =>
    apiRequest<any>("/interview/start", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  answerInterview: (payload: {
    session_id: string;
    question: string;
    answer_text: string;
    interview_mode: string;
    target_role: string;
    question_index: number;
    total_questions: number;
    language?: string;
    resume_context?: any;
  }) =>
    apiRequest<any>("/interview/answer", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  evaluateInterview: (payload: {
    session_id: string;
    target_role: string;
    interview_mode: string;
    qa_history: any[];
    language?: string;
  }) =>
    apiRequest<any>("/interview/evaluate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteChatHistory: (session_id: string = "default") =>
    apiRequest<{ status: string; message: string }>(`/chat/history?session_id=${encodeURIComponent(session_id)}`, {
      method: "DELETE",
    }),
};

// Template Studio & Multi-Version API
export const templateApi = {
  listTemplates: (category?: string) =>
    apiRequest<TemplateMetadata[]>(`/templates${category ? `?category=${encodeURIComponent(category)}` : ""}`),

  getTemplate: (id: string) =>
    apiRequest<TemplateMetadata>(`/templates/${id}`),

  recommendTemplates: (payload: TemplateRecommendationRequest) =>
    apiRequest<TemplateRecommendationResponse>("/templates/recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  create5Versions: (payload: Create5VersionsRequest) =>
    apiRequest<Create5VersionsResponse>("/templates/create-5-versions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};


