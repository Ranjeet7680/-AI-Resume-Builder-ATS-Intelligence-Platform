"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, CheckCircle2, Target, Download, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { resumeApi, exportApi } from "@/lib/api";
import { ResumeData } from "@/types/resume";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await resumeApi.list();
        setResumes(data);
      } catch (e) {
        // Fallback demo data
        setResumes([
          {
            id: "sample-resume-1",
            title: "Senior Full Stack Engineer Resume",
            target_role: "Senior Full Stack Engineer",
            template_id: "modern-ats",
            personal_info: {
              fullName: "Alex Chen",
              headline: "Senior Full Stack & AI Engineer",
              email: "alex.chen.dev@example.com",
              phone: "+1 (555) 234-5678",
              location: "San Francisco, CA",
              summary: "High-impact Full Stack and AI Engineer with 5+ years of experience architecting distributed systems.",
            },
            experiences: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            ats_score: 88,
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Career Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your ATS-optimized resumes and job application tailored versions.
          </p>
        </div>

        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" /> Create New Resume
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Active Resumes</span>
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{resumes.length}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Avg. ATS Score</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">88 / 100</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Target Role Readiness</span>
            <Target className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">High (92%)</div>
        </div>
      </div>

      {/* Flagship Feature Card: Paste Job Description */}
      <div className="rounded-2xl border-2 border-blue-500/20 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-6 shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold">
            <Sparkles className="h-3 w-3" /> Flagship Feature
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Paste Job Description ➔ AI Tailor My Resume
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Have a target role at Google, Stripe, or a high-growth startup? Paste the job posting to analyze keyword gaps, optimize bullets with the XYZ formula, and generate a dedicated tailored version without modifying your original resume.
          </p>
        </div>
        <Link
          href="/tailor"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-xs font-bold shadow-lg shadow-blue-500/20 transition whitespace-nowrap"
        >
          <Target className="h-4 w-4" /> Launch AI Tailor Studio
        </Link>
      </div>

      {/* Resumes List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">My Resumes</h2>

        {isLoading ? (
          <div className="text-center py-12 text-sm text-slate-400">Loading your resumes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{resume.title}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Target Role: {resume.target_role || "Software Engineer"}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                      ATS: {resume.ats_score || 88}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {resume.personal_info?.summary || "No summary added yet."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {resume.id && (
                      <a
                        href={exportApi.getDocxExportUrl(resume.id)}
                        className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded bg-slate-50 border border-slate-200"
                      >
                        <Download className="h-3 w-3" /> Word
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/builder/${resume.id || "new"}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Open Live Builder <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
