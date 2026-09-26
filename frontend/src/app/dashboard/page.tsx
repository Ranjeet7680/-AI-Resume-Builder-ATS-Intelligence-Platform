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
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-6xl space-y-8">
      {/* 1. WELCOME & CAREER READINESS SCORECARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Career Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-2">
              Good morning, Alex 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Your career readiness is in the top 15% for Staff & Senior Engineering roles. 3 interviews scheduled this week.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/builder/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Create New Resume
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Layers className="h-4 w-4 text-purple-600" /> 24+ Templates
            </Link>
          </div>
        </div>

        {/* Career Readiness Meter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Career Readiness</span>
            <div className="text-2xl font-black text-blue-900">78 <span className="text-xs font-normal text-slate-500">/ 100</span></div>
            <span className="text-[10px] text-emerald-600 font-semibold block">▲ +12% this month</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Avg. ATS Pass Rate</span>
            <div className="text-2xl font-black text-emerald-900">92%</div>
            <span className="text-[10px] text-emerald-600 font-semibold block">100% Parsable formats</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Skills Alignment</span>
            <div className="text-2xl font-black text-purple-900">74%</div>
            <span className="text-[10px] text-slate-500 block">Top Match: Python & PyTorch</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Active Applications</span>
            <div className="text-2xl font-black text-amber-900">12</div>
            <span className="text-[10px] text-slate-500 block">3 Interviews • 1 Offer</span>
          </div>
        </div>
      </div>

      {/* 2. CONTEXTUAL PROMOTION / CAREER TIP BANNER */}
      <PromotionBanner targetPage="dashboard" />

      {/* 3. QUICK ACTION LAUNCHER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/tailor"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition flex flex-col justify-between group"
        >
          <div className="space-y-1.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 w-fit">
              <Target className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition block">
              AI Job Tailor
            </span>
            <p className="text-xs text-slate-500">Paste job description ➔ Match keywords</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 pt-3 flex items-center gap-1">
            Tailor Now <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/career-coach"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-sm transition flex flex-col justify-between group"
        >
          <div className="space-y-1.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 w-fit">
              <Mic className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition block">
              Voice Interview Coach
            </span>
            <p className="text-xs text-slate-500">Practice live technical & HR Q&A</p>
          </div>
          <span className="text-xs font-semibold text-purple-600 pt-3 flex items-center gap-1">
            Start Mock <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/ats-analyzer"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition flex flex-col justify-between group"
        >
          <div className="space-y-1.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition block">
              ATS Checker
            </span>
            <p className="text-xs text-slate-500">Test Workday & Taleo parsing</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 pt-3 flex items-center gap-1">
            Run Scan <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        <Link
          href="/applications"
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition flex flex-col justify-between group"
        >
          <div className="space-y-1.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 w-fit">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition block">
              Application Tracker
            </span>
            <p className="text-xs text-slate-500">Kanban pipeline & interview dates</p>
          </div>
          <span className="text-xs font-semibold text-amber-600 pt-3 flex items-center gap-1">
            View Pipeline <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>

      {/* 4. RECENT RESUMES LIST */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Resumes ({resumes.length})</h2>
            <p className="text-xs text-slate-500">
              Each resume retains verified career facts while utilizing tailored designs and ATS keywords.
            </p>
          </div>
          <Link
            href="/templates"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" /> 1-Click 5-Version Generator →
          </Link>
        </div>

        <div className="space-y-3">
          {resumes.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{res.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {res.ats_score || 90}% ATS Score
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Template: {res.template_id}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Target: <strong>{res.target_role}</strong> • {res.personal_info.fullName}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated recently
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <Link
                  href={`/builder/${res.id}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Edit Content
                </Link>
                <Link
                  href="/templates"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Change Design
                </Link>
                {res.id && (
                  <>
                    <a
                      href={exportApi.getDocxExportUrl(res.id)}
                      download
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition inline-flex items-center gap-1"
                      title="Word .docx"
                    >
                      <Download className="h-3 w-3" /> Word
                    </a>
                    <a
                      href={exportApi.getTxtExportUrl(res.id)}
                      download
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition inline-flex items-center gap-1"
                      title="Plain Text ATS"
                    >
                      .TXT
                    </a>
                    <button
                      onClick={() => handleCopyLink(res.id!)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition inline-flex items-center gap-1"
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
