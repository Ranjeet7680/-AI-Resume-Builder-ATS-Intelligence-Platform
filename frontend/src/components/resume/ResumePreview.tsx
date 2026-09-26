"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Download, FileCode, Printer, CheckCircle } from "lucide-react";
import { exportApi } from "@/lib/api";

export default function ResumePreview() {
  const { resume } = useResumeStore();
  const { personal_info: p, experiences, education, skills, projects } = resume;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      {/* Top Action Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Preview</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <CheckCircle className="h-3 w-3" /> ATS Ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </button>
          {resume.id && (
            <a
              href={exportApi.getDocxExportUrl(resume.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" /> Word (.docx)
            </a>
          )}
        </div>
      </div>

      {/* Rendered Resume Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">
        <div
          id="resume-printable"
          className="w-full max-w-[800px] bg-white min-h-[1050px] shadow-lg border border-slate-200 p-8 sm:p-10 text-slate-900 font-sans"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 mb-4">
            <h1 className="text-2xl font-bold tracking-tight uppercase text-slate-900">
              {p.fullName || "Your Full Name"}
            </h1>
            {p.headline && (
              <p className="text-sm font-medium text-slate-600 mt-0.5">{p.headline}</p>
            )}

            {/* Contact Row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
              {p.email && <span>📧 {p.email}</span>}
              {p.phone && <span>📱 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
              {p.github && <span>💻 {p.github}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {p.summary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">{p.summary}</p>
            </div>
          )}

          {/* Experience Section */}
          {experiences && experiences.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{exp.title || "Job Title"}</span>
                      <span className="font-normal text-slate-500">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 italic text-[11px] mb-1">
                      <span>{exp.company || "Company"}</span>
                      <span>{exp.location}</span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc ml-4 space-y-1 text-slate-700">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Technical Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{proj.title}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {proj.technologies.join(", ")}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc ml-4 space-y-0.5 text-slate-700 mt-1">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Technical Skills
              </h2>
              <div className="space-y-1.5 text-xs">
                {skills.map((cat, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-semibold text-slate-900 min-w-[140px]">{cat.category}:</span>
                    <span className="text-slate-700">{cat.items.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{edu.institution}</span>
                      <span className="font-normal text-slate-500">
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                      {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                    </div>
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
