"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { resumeApi, exportApi } from "@/lib/api";
import { ResumeData } from "@/types/resume";
import { Eye, Download, Printer, Linkedin, Github, Mail, Globe, Sparkles, CheckCircle2 } from "lucide-react";

export default function PublicResumePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const data = await resumeApi.getPublic(slug);
        setResume(data);
      } catch {
        // Fallback preview
        setResume({
          title: "Senior Full Stack & AI Engineer",
          target_role: "Senior Full Stack Engineer",
          template_id: "modern-ats",
          view_count: 142,
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
              highlights: ["Dean's Honor List"]
            }
          ],
          skills: [
            {
              category: "Languages & Frameworks",
              items: ["Python", "TypeScript", "FastAPI", "React", "Next.js", "SQL"]
            },
            {
              category: "Cloud & Infrastructure",
              items: ["Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis"]
            }
          ],
          projects: [
            {
              id: "proj-1",
              title: "Real-time Vector Search Engine",
              description: "Semantic similarity search service leveraging pgvector and FastAPI.",
              technologies: ["Python", "pgvector", "FastAPI"],
              link: "https://github.com/alexchen/vector-search",
              bullets: ["Sub-15ms vector retrieval across 2M document embeddings with 99.4% recall."]
            }
          ],
          certifications: [],
          ats_score: 88,
        });
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPublic();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-sm text-slate-400">
        Loading public resume...
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-sm text-slate-500">
        Resume not found or currently set to private.
      </div>
    );
  }

  const p = resume.personal_info;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Floating Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" /> Verified Public Profile
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              {resume.view_count || 142} views
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </button>
            {resume.id && (
              <a
                href={exportApi.getDocxExportUrl(resume.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition"
              >
                <Download className="h-3.5 w-3.5" /> Download (.docx)
              </a>
            )}
          </div>
        </div>

        {/* Resume Sheet */}
        <div
          id="resume-printable"
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 text-slate-900 font-sans"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                  {p.fullName}
                </h1>
                {p.headline && (
                  <p className="text-sm font-semibold text-slate-600 mt-1">{p.headline}</p>
                )}
              </div>

              {/* Social Quick Connect Buttons */}
              <div className="flex flex-wrap gap-2">
                {p.linkedin && (
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-semibold hover:bg-[#006097] transition"
                  >
                    <Linkedin className="h-3.5 w-3.5" /> Connect on LinkedIn
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition"
                  >
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
              {p.email && <span>📧 {p.email}</span>}
              {p.phone && <span>📱 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
            </div>
          </div>

          {/* Summary */}
          {p.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">{p.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experiences && resume.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3">
                Work Experience
              </h2>
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{exp.title}</span>
                      <span className="font-normal text-slate-500">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-slate-600 italic text-[11px] mb-1.5">{exp.company} • {exp.location}</div>
                    <ul className="list-disc ml-4 space-y-1 text-slate-700">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3">
                Key Projects
              </h2>
              <div className="space-y-3 text-xs">
                {resume.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{proj.title}</span>
                      {proj.technologies && (
                        <span className="font-mono text-[11px] text-slate-500">{proj.technologies.join(", ")}</span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Technical Skills
              </h2>
              <div className="space-y-1.5 text-xs">
                {resume.skills.map((cat, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-semibold text-slate-900 min-w-[140px]">{cat.category}:</span>
                    <span className="text-slate-700">{cat.items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{edu.institution}</span>
                      <p className="text-slate-600 text-[11px]">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</p>
                    </div>
                    <span className="text-slate-500">{edu.startDate} — {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
