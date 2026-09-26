export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  url?: string;
}

export interface ResumeData {
  id?: string;
  user_id?: string;
  title: string;
  target_role: string;
  template_id: string;
  public_slug?: string;
  is_public?: boolean;
  view_count?: number;
  personal_info: PersonalInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  ats_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ATSScoreBreakdown {
  overall: number;
  keywords: number;
  skills: number;
  experience: number;
  formatting: number;
  achievements: number;
}

export interface ATSAnalysis {
  overall_score: number;
  breakdown: ATSScoreBreakdown;
  matched_keywords: string[];
  missing_keywords: string[];
  action_verb_count: number;
  metric_count: number;
  formatting_issues: string[];
  strong_points: string[];
  suggestions: string[];
}

export interface JobMatchResult {
  job_title: string;
  company?: string;
  overall_match: number;
  technical_match: number;
  experience_match: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  headline?: string;
}
