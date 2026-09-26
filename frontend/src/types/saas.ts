export interface JobApplicationItem {
  id: string;
  user_id: string;
  company: string;
  role: string;
  job_url?: string;
  location?: string;
  salary_range?: string;
  resume_id?: string;
  resume_version_name?: string;
  status: "saved" | "applied" | "screening" | "interview" | "offer" | "rejected";
  applied_date?: string;
  interview_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  full_name?: string;
  headline?: string;
  avatar_url?: string;
  summary?: string;
  completeness_score: number;
  missing_sections: string[];
  has_completed_onboarding: boolean;
}

export interface OnboardingData {
  goal: string;
  target_role: string;
  experience_level: string;
  industry: string;
  location_preference?: string;
  skills: string[];
  linkedin_url?: string;
  github_url?: string;
}

export interface UserSettingsData {
  theme: "light" | "dark" | "system";
  language: string;
  voice_speed: number;
  voice_id: string;
  auto_play_voice: boolean;
  notifications_email: boolean;
  notifications_interviews: boolean;
  notifications_applications: boolean;
  public_profile_enabled: boolean;
  analytics_enabled: boolean;
  plan: "free" | "pro" | "enterprise";
  max_resumes_allowed: number;
}

export interface GitHubRepoAnalysisItem {
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  topics: string[];
  suggested_resume_project_title: string;
  suggested_bullets: string[];
  technologies: string[];
}

export interface GitHubAnalysisData {
  username: string;
  total_repos_analyzed: number;
  primary_languages: string[];
  top_repositories: GitHubRepoAnalysisItem[];
  extracted_technical_skills: string[];
  portfolio_quality_rating: number;
  strategic_recommendations: string[];
}

export interface CampaignItem {
  id: string;
  title: string;
  description: string;
  cta_text: string;
  cta_url: string;
  campaign_type: "career_tip" | "banner" | "upgrade_promo" | "partner" | string;
  target_page: string;
  is_active: boolean;
  impression_count: number;
  click_count: number;
}

export interface AdminStatsData {
  total_users: number;
  active_subscriptions: number;
  resumes_created: number;
  tailored_versions_generated: number;
  ai_queries_processed: number;
  voice_minutes_conducted: number;
  system_uptime_percentage: number;
  active_campaigns: number;
  revenue_mrr_inr: number;
}

export interface CareerAnalyticsData {
  user_id: string;
  overview: {
    career_readiness_score: number;
    overall_ats_score: number;
    total_resumes: number;
    total_applications: number;
    interviews_scheduled: number;
    offers_received: number;
    public_views: number;
    docx_downloads: number;
    txt_exports: number;
  };
  application_pipeline: Record<string, number>;
  ats_breakdown: Record<string, number>;
  weekly_activity: { day: string; views: number; applications: number }[];
  top_matching_roles: { role: string; match_percentage: number }[];
}
