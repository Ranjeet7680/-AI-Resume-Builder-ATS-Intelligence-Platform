export interface ResumeHealthBreakdown {
  overall: number;
  content: number;
  ats_compatibility: number;
  skills: number;
  experience: number;
  projects: number;
  education: number;
  formatting: number;
  readability: number;
  impact: number;
}

export interface OverusedWordItem {
  word: string;
  count: number;
  severity: string;
  suggested_alternatives: string[];
}

export interface KeywordIntelligence {
  present_keywords: string[];
  missing_target_keywords: string[];
  overused_words: OverusedWordItem[];
}

export interface ExperienceAuditItem {
  exp_id: string;
  title: string;
  company: string;
  bullet: string;
  score: number;
  has_action_verb: boolean;
  has_metric: boolean;
  detected_verb?: string;
  issue?: string;
  suggested_fix?: string;
}

export interface TruthConsistencyIssue {
  text: string;
  claim_type: string;
  flag_reason: string;
  recommendation: string;
}

export interface ResumeHealthReport {
  overall_score: number;
  health: ResumeHealthBreakdown;
  keyword_intel: KeywordIntelligence;
  experience_audit: ExperienceAuditItem[];
  truth_check: TruthConsistencyIssue[];
  strong_points: string[];
  critical_fixes: string[];
}

export interface InterviewQuestion {
  category: string;
  question: string;
  context_source?: string;
  sample_answer_framework: string;
  tips: string;
}

export interface InterviewPrepResult {
  target_role: string;
  technical_questions: InterviewQuestion[];
  behavioral_questions: InterviewQuestion[];
  project_questions: InterviewQuestion[];
}

export interface RoadmapStep {
  step_number: number;
  skill: string;
  importance: string;
  why_needed: string;
  learning_resources: string[];
  portfolio_project_idea: string;
}

export interface CareerRoadmapResult {
  target_role: string;
  current_skills: string[];
  gap_skills: string[];
  roadmap: RoadmapStep[];
}
