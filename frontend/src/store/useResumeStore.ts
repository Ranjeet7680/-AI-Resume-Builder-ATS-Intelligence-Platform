import { create } from "zustand";
import { ResumeData, ExperienceItem, EducationItem, SkillCategory, ProjectItem, ATSAnalysis } from "@/types/resume";
import { atsApi } from "@/lib/api";

const initialResume: ResumeData = {
  title: "Full Stack Engineer Resume",
  target_role: "Senior Full Stack Engineer",
  template_id: "modern-ats",
  personal_info: {
    fullName: "Alex Chen",
    headline: "Senior Full Stack & AI Engineer",
    email: "alex.chen.dev@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    linkedin: "https://linkedin.com/in/alexchen",
    github: "https://github.com/alexchen",
    summary: "High-impact Full Stack and AI Engineer with 5+ years of experience architecting distributed cloud systems, modern React frontends, and production LLM pipelines. Proven ability to reduce latency by 45% and lead high-velocity product squads.",
  },
  experiences: [
    {
      id: "exp-1",
      title: "Senior Software Engineer",
      company: "ScaleAI Dynamics",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected distributed microservices handling 45M+ daily requests using FastAPI, Redis, and PostgreSQL.",
        "Optimized database query performance and index strategies, reducing p99 API response latencies from 320ms to 48ms.",
        "Spearheaded adoption of automated CI/CD deployment pipelines on Kubernetes, accelerating release velocity by 65%."
      ]
    },
    {
      id: "exp-2",
      title: "Full Stack Developer",
      company: "Nexus Web Systems",
      location: "New York, NY",
      startDate: "2020-01",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Engineered modular React & TypeScript design system utilized by 20+ software engineers across 4 business units.",
        "Implemented secure OAuth 2.0 and role-based access control protecting confidential customer records."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Software Systems & Machine Learning",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.85",
      highlights: ["Dean's Honor List", "President of Open Source Developers Club"]
    }
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["Python", "TypeScript", "FastAPI", "React", "Next.js", "Node.js", "SQL"]
    },
    {
      category: "Cloud & Infrastructure",
      items: ["Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis", "GitHub Actions"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Real-time Vector Search Engine",
      description: "High-throughput semantic similarity search service leveraging pgvector and FastAPI.",
      technologies: ["Python", "pgvector", "FastAPI", "Docker"],
      link: "https://github.com/alexchen/vector-search",
      bullets: [
        "Benchmarked sub-15ms vector retrieval across 2M document embeddings with 99.4% recall."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023",
      url: "https://aws.amazon.com/certification"
    }
  ],
  ats_score: 88,
};

interface ResumeState {
  resume: ResumeData;
  atsAnalysis: ATSAnalysis | null;
  isAnalyzingAts: boolean;
  activeSection: string;
  setResume: (resume: ResumeData) => void;
  updatePersonalInfo: (field: string, value: string) => void;
  updateTargetRole: (role: string) => void;
  setTemplate: (templateId: string) => void;
  setActiveSection: (section: string) => void;
  
  // Experience actions
  addExperience: () => void;
  updateExperience: (id: string, updated: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (expId: string, bulletText?: string) => void;
  updateExperienceBullet: (expId: string, index: number, text: string) => void;
  removeExperienceBullet: (expId: string, index: number) => void;

  // Skills actions
  updateSkillCategory: (index: number, category: string, items: string[]) => void;
  addSkillCategory: () => void;
  addSkill: (category: string, skill: string) => void;
  removeSkillCategory: (index: number) => void;

  // Run live ATS check
  runAtsAnalysis: () => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: initialResume,
  atsAnalysis: null,
  isAnalyzingAts: false,
  activeSection: "profile",

  setResume: (resume) => set({ resume }),
  
  updatePersonalInfo: (field, value) =>
    set((state) => ({
      resume: {
        ...state.resume,
        personal_info: {
          ...state.resume.personal_info,
          [field]: value,
        },
      },
    })),

  updateTargetRole: (target_role) =>
    set((state) => ({
      resume: { ...state.resume, target_role },
    })),

  setTemplate: (template_id) =>
    set((state) => ({
      resume: { ...state.resume, template_id },
    })),

  setActiveSection: (activeSection) => set({ activeSection }),

  addExperience: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: [
          {
            id: `exp-${Date.now()}`,
            title: "New Role",
            company: "Company Name",
            location: "Location",
            startDate: "2023",
            endDate: "Present",
            current: true,
            bullets: ["Accomplished key milestones delivering business objectives."],
          },
          ...state.resume.experiences,
        ],
      },
    })),

  updateExperience: (id, updated) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.map((exp) =>
          exp.id === id ? { ...exp, ...updated } : exp
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.filter((exp) => exp.id !== id),
      },
    })),

  addExperienceBullet: (expId, bulletText = "Engineered key architectural components.") =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.map((exp) =>
          exp.id === expId ? { ...exp, bullets: [...exp.bullets, bulletText] } : exp
        ),
      },
    })),

  updateExperienceBullet: (expId, index, text) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.map((exp) => {
          if (exp.id !== expId) return exp;
          const updatedBullets = [...exp.bullets];
          updatedBullets[index] = text;
          return { ...exp, bullets: updatedBullets };
        }),
      },
    })),

  removeExperienceBullet: (expId, index) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.map((exp) => {
          if (exp.id !== expId) return exp;
          const updatedBullets = exp.bullets.filter((_, i) => i !== index);
          return { ...exp, bullets: updatedBullets };
        }),
      },
    })),

  updateSkillCategory: (index, category, items) =>
    set((state) => {
      const skills = [...state.resume.skills];
      skills[index] = { category, items };
      return { resume: { ...state.resume, skills } };
    }),

  addSkillCategory: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: [...state.resume.skills, { category: "New Category", items: ["Skill A", "Skill B"] }],
      },
    })),

  addSkill: (category, skill) =>
    set((state) => {
      const skills = state.resume.skills.map((s) => ({ ...s, items: [...s.items] }));
      const existing = skills.find((s) => s.category.toLowerCase() === category.toLowerCase());
      if (existing) {
        if (!existing.items.includes(skill)) {
          existing.items.push(skill);
        }
      } else {
        skills.push({ category, items: [skill] });
      }
      return { resume: { ...state.resume, skills } };
    }),

  removeSkillCategory: (index) =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.filter((_, i) => i !== index),
      },
    })),

  runAtsAnalysis: async () => {
    const { resume } = get();
    set({ isAnalyzingAts: true });
    try {
      const analysis = await atsApi.analyze({
        resume_data: resume,
        target_role: resume.target_role,
      });
      set({
        atsAnalysis: analysis,
        resume: { ...resume, ats_score: analysis.overall_score },
        isAnalyzingAts: false,
      });
    } catch {
      // Offline fallback calculation
      set({ isAnalyzingAts: false });
    }
  },
}));
