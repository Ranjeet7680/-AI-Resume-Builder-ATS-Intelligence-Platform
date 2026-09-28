"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  CheckCircle2,
  Target,
  Download,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Bot,
  Mic,
  Layers,
  Briefcase,
  TrendingUp,
  Clock,
  Copy,
  Zap,
} from "lucide-react";
import { resumeApi, exportApi, templateApi } from "@/lib/api";
import { ResumeData } from "@/types/resume";
import PromotionBanner from "@/components/common/PromotionBanner";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await resumeApi.list();
        if (data && data.length > 0) {
          setResumes(data);
        } else {
          throw new Error("No resumes");
        }
      } catch {
        // High-quality fallback demo records
        setResumes([
          {
            id: "res-1",
            title: "Senior Full Stack & AI Engineer",
            target_role: "Staff Software Engineer",
            template_id: "ats-minimal",
            ats_score: 94,
            updated_at: new Date().toISOString(),
            personal_info: {
              fullName: "Alex Chen",
              headline: "Senior Full Stack & Distributed Systems Engineer",
              email: "alex.chen.dev@example.com",
              phone: "+1 (555) 234-5678",
              location: "San Francisco, CA / Remote",
              summary: "High-impact engineer with 5+ years of experience architecting distributed cloud systems and production LLM pipelines.",
            },
            experiences: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
          },
          {
            id: "res-2",
            title: "Anthropic Staff Systems Tailored",
            target_role: "Staff Platform Engineer",
            template_id: "swe-tech",
            ats_score: 91,
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            personal_info: {
              fullName: "Alex Chen",
              headline: "Distributed Systems & Cloud Infrastructure",
              email: "alex.chen.dev@example.com",
              phone: "+1 (555) 234-5678",
              location: "San Francisco, CA",
              summary: "Specializing in Redis Streams, pgvector, and zero-downtime Kubernetes deployments.",
            },
            experiences: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
          },
          {
            id: "res-3",
            title: "Compact 1-Page Engineering Resume",
            target_role: "AI / ML Engineer",
            template_id: "ats-onepage",
            ats_score: 89,
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            personal_info: {
              fullName: "Alex Chen",
              headline: "AI & ML Infrastructure Engineer",
              email: "alex.chen.dev@example.com",
              phone: "+1 (555) 234-5678",
              location: "San Francisco, CA",
              summary: "Dense one-page format optimized for 6-second recruiter scans.",
            },
            experiences: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/r/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-8 max-w-6xl space-y-8 animate-fade-in-up">
      {/* 1. WELCOME & CAREER READINESS SCORECARD */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-glow">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
              <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
              Career Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
              Good morning, Alex 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Your career readiness is in the top 15% for Staff & Senior Engineering roles. 3 interviews scheduled this week.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5">
            <Link
              href="/builder/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all"
            >
              <Plus className="h-4 w-4" /> Create Resume
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs"
            >
              <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" /> 24+ Templates
            </Link>
          </div>
        </div>

        {/* Career Readiness Meter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-blue-50/20 dark:from-blue-950/40 dark:to-slate-900 border border-blue-100 dark:border-blue-900/60 space-y-1.5 transition-transform hover:-translate-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Career Readiness</span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-100">78 <span className="text-xs font-normal text-slate-500">/ 100</span></div>
            <div className="w-full bg-blue-100 dark:bg-blue-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[78%] rounded-full" />
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">▲ +12% this month</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-emerald-50/20 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-100 dark:border-emerald-900/60 space-y-1.5 transition-transform hover:-translate-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Avg. ATS Pass Rate</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-100">92%</div>
            <div className="w-full bg-emerald-100 dark:bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-[92%] rounded-full" />
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">100% Parsable formats</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-purple-50/20 dark:from-purple-950/40 dark:to-slate-900 border border-purple-100 dark:border-purple-900/60 space-y-1.5 transition-transform hover:-translate-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Skills Alignment</span>
            <div className="text-xl sm:text-2xl font-black text-purple-900 dark:text-purple-100">74%</div>
            <div className="w-full bg-purple-100 dark:bg-purple-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[74%] rounded-full" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Top: Python & PyTorch</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-amber-50/20 dark:from-amber-950/40 dark:to-slate-900 border border-amber-100 dark:border-amber-900/60 space-y-1.5 transition-transform hover:-translate-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Applications</span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100">12</div>
            <div className="w-full bg-amber-100 dark:bg-amber-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[65%] rounded-full" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">3 Interviews • 1 Offer</span>
          </div>
        </div>
      </div>

      {/* 2. CONTEXTUAL PROMOTION / CAREER TIP BANNER */}
      <PromotionBanner targetPage="dashboard" />

      {/* 3. QUICK ACTION LAUNCHER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/tailor"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm w-fit group-hover:scale-110 transition-transform">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition block">
              AI Job Tailor
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Paste job description ➔ Match keywords</p>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 pt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Tailor Now <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/career-coach"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm w-fit group-hover:scale-110 transition-transform">
              <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition block">
              Voice Career Coach
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Live verbal Q&A in 12 Indian languages</p>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 pt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Start Mock <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/ats-analyzer"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-sm w-fit group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition block">
              ATS Checker
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Test Workday & Taleo parsing</p>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Run Scan <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/applications"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm w-fit group-hover:scale-110 transition-transform">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition block">
              Job Tracker
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Kanban pipeline & interview dates</p>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 pt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Pipeline <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>

      {/* 4. RECENT RESUMES LIST */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Resumes ({resumes.length})</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each resume retains verified career facts while utilizing tailored designs and ATS keywords.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" /> 1-Click 5-Version Generator →
          </Link>
        </div>

        <div className="space-y-3">
          {resumes.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-800/40"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{res.title}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {res.ats_score || 90}% ATS Score
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Template: {res.template_id}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Target: <strong>{res.target_role}</strong> • {res.personal_info.fullName}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated recently
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1 sm:pt-0">
                <Link
                  href={`/builder/${res.id}`}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold transition shadow-xs"
                >
                  Edit Content
                </Link>
                <Link
                  href="/templates"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition"
                >
                  Change Design
                </Link>
                {res.id && (
                  <div className="flex items-center gap-1.5">
                    <a
                      href={exportApi.getDocxExportUrl(res.id)}
                      download
                      className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition inline-flex items-center gap-1"
                      title="Word .docx"
                    >
                      <Download className="h-3 w-3" /> Word
                    </a>
                    <a
                      href={exportApi.getTxtExportUrl(res.id)}
                      download
                      className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition inline-flex items-center gap-1"
                      title="Plain Text ATS"
                    >
                      .TXT
                    </a>
                    <button
                      onClick={() => handleCopyLink(res.id!)}
                      className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition inline-flex items-center gap-1"
                      title="Share Public Link"
                    >
                      {copiedId === res.id ? (
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Share
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
