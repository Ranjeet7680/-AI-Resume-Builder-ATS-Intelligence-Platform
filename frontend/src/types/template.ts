export interface TemplateCustomizationConfig {
  font_family: string; // Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Merriweather, Georgia
  color_theme: string; // Primary accent hex code
  layout_format: "single" | "two-column" | "compact" | "timeline";
  font_size: "sm" | "md" | "lg";
  line_spacing: "compact" | "normal" | "relaxed";
  section_spacing: "compact" | "normal" | "relaxed";
  page_margin: "narrow" | "normal" | "wide";
  header_style: "left" | "center" | "banner";
  show_photo: boolean;
  section_order: string[];
}

export interface TemplateMetadata {
  id: string;
  name: string;
  category: "ats" | "modern" | "tech" | "data_ai" | "student_fresher" | "executive" | "creative" | string;
  description: string;
  ats_score: number;
  is_ats_guaranteed: boolean;
  preview_tag: string;
  recommended_for: string[];
  layout_default: "single" | "two-column" | "compact" | "timeline" | string;
}

export interface TemplateRecommendationRequest {
  target_role?: string;
  experience_level?: "fresher" | "experienced" | "executive" | "student" | string;
  industry?: string;
  job_description?: string;
  resume_data?: any;
}

export interface TemplateRecommendationItem {
  template_id: string;
  template_name: string;
  category: string;
  match_score: number;
  is_primary_recommendation: boolean;
  rationale: string;
  key_advantages: string[];
}

export interface TemplateRecommendationResponse {
  target_role: string;
  experience_level: string;
  recommended_templates: TemplateRecommendationItem[];
  advice_summary: string;
}

export interface Create5VersionsRequest {
  resume_id?: string;
  resume_data?: any;
  target_role?: string;
  job_description?: string;
}

export interface CreatedVersionItem {
  id: string;
  version_name: string;
  template_id: string;
  purpose: string;
  ats_score: number;
  public_slug?: string;
  download_urls: {
    docx: string;
    pdf?: string;
    txt: string;
    html: string;
    web?: string;
  };
}

export interface Create5VersionsResponse {
  status: string;
  total_versions: number;
  message: string;
  versions: CreatedVersionItem[];
}
