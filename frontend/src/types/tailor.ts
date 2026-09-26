import { ResumeData } from "./resume";

export interface JobAnalysis {
  job_title: string;
  company?: string;
  experience_level: string;
  required_skills: string[];
  preferred_skills: string[];
  keywords: string[];
  skill_categories: Record<string, string[]>;
  responsibilities: string[];
}

export interface TailoredSectionDiff {
  section: "summary" | "experience" | "skills" | "projects";
  title: string;
  before: any;
  after: any;
  explanation: string;
}

export interface TailorResult {
  job_title: string;
  company?: string;
  original_ats_score: number;
  projected_ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  diffs: TailoredSectionDiff[];
  tailored_resume: ResumeData;
  saved_resume_id?: string;
}
