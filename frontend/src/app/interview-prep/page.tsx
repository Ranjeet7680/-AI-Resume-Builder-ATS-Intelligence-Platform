"use client";

import { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/store/useResumeStore";
import { analysisApi } from "@/lib/api";
import { InterviewPrepResult } from "@/types/analysis";
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FolderGit2,
  Code2,
  MessageSquare,
  Wand2,
  ChevronRight,
  Copy,
  Check,
  Mic,
} from "lucide-react";

export default function InterviewPrepPage() {
  const { resume } = useResumeStore();
  const [targetRole, setTargetRole] = useState(resume.target_role || "Senior Software Engineer");
  const [jobDescription, setJobDescription] = useState(
    "Looking for a Senior Software Engineer experienced in Python, FastAPI, distributed caching with Redis, and PostgreSQL."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [prepResult, setPrepResult] = useState<InterviewPrepResult | null>({
    target_role: "Senior Software Engineer",
    technical_questions: [
      {
        category: "Technical Deep-Dive",
        question: "In Python and FastAPI, how do you handle concurrency bottlenecks between CPU-bound calculations and asynchronous I/O operations?",
        context_source: "Derived from your listed skill: Python & FastAPI",
        sample_answer_framework: "1) Explain Python GIL and asyncio event loop limitations, 2) Offload CPU tasks to multiprocessing / Celery background workers, 3) Maintain non-blocking async DB connection pool with asyncpg.",
        tips: "Recruiters look for architectural understanding of how the event loop interacts with blocking system calls.",
      },
      {
        category: "Technical Deep-Dive",
        question: "How do you design database index strategies in PostgreSQL for tables with 10M+ rows when handling high write-to-read ratios?",
        context_source: "Derived from your listed skill: PostgreSQL",
        sample_answer_framework: "1) Partial indexing to minimize index write overhead, 2) BRIN indexes for append-only timestamped logs, 3) Connection pooling via PgBouncer.",
        tips: "Always mention write penalty of excessive indexing and explain trade-offs.",
      },
    ],
    behavioral_questions: [
      {
        category: "Behavioral (STAR Method)",
        question: "Tell me about a high-pressure production bug or system degradation you resolved under tight deadlines.",
        context_source: "Standard Senior Engineering Screening",
        sample_answer_framework: "Situation (sudden 500 errors during traffic peak) ➔ Task (isolate root cause and restore SLA) ➔ Action (inspected Sentry logs, isolated faulty connection pool, applied hotfix rollback) ➔ Result (restored in 15 mins + wrote blameless postmortem).",
        tips: "Focus heavily on the systematic diagnostic process and blameless retrospective.",
      },
    ],
    project_questions: [
      {
        category: "Project Architecture",
        question: "In your 'Real-time Vector Search Engine' project, what made you select pgvector over dedicated vector stores like Pinecone or Qdrant?",
        context_source: "Resume Project: Real-time Vector Search Engine",
        sample_answer_framework: "1) Operational simplicity of keeping relational and vector embeddings in the same ACID-compliant database, 2) Benchmarked sub-15ms retrieval across 2M rows, 3) Eliminated dual-write sync complexity.",
        tips: "Defend your architectural trade-offs using real constraints like simplicity, latency, and operational cost.",
      },
    ],
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await analysisApi.generateInterviewPrep({
        resume_data: resume,
        target_role: targetRole,
        job_description: jobDescription,
      });
      setPrepResult(res);
    } catch {
      // Keep rich defaults
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          AI Interview Preparation Engine
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Role &amp; Resume-Specific Interview Prep
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Generate realistic interview questions derived directly from your resume&apos;s actual projects and skills, complete with STAR response frameworks.
        </p>
      </div>

      {/* Control Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Target Job Description (Optional)</label>
            <input
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Senior Backend Engineer with Python & AWS"
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition disabled:opacity-60"
          >
            <Wand2 className="h-4 w-4" />
            {isLoading ? "Generating Questions..." : "Generate Custom Interview Questions"}
          </button>
        </div>
      </div>

      {/* Questions Results */}
      {prepResult && (
        <div className="space-y-8">
          {/* 1. Project-Specific Architecture Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <FolderGit2 className="h-4 w-4 text-blue-600" />
              1. Resume Project Deep-Dives (Recruiter Favorite)
            </h3>
            <div className="space-y-4">
              {prepResult.project_questions.map((q, i) => (
                <QuestionCard key={i} q={q} />
              ))}
            </div>
          </div>

          {/* 2. Technical Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Code2 className="h-4 w-4 text-emerald-600" />
              2. Technical Architecture &amp; Coding Questions
            </h3>
            <div className="space-y-4">
              {prepResult.technical_questions.map((q, i) => (
                <QuestionCard key={i} q={q} />
              ))}
            </div>
          </div>

          {/* 3. Behavioral Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              3. Behavioral Questions (STAR Method)
            </h3>
            <div className="space-y-4">
              {prepResult.behavioral_questions.map((q, i) => (
                <QuestionCard key={i} q={q} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q }: { q: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(q.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3.5 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
          &ldquo;{q.question}&rdquo;
        </h4>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy question text"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {q.category}
          </span>
        </div>
      </div>

      {q.context_source && (
        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block">
          🔍 Source: {q.context_source}
        </span>
      )}

      {/* Answer Framework */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
        <strong className="block font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Recommended Response Structure (STAR):
        </strong>
        <p className="leading-relaxed font-sans text-slate-700 dark:text-slate-300">{q.sample_answer_framework}</p>
      </div>

      {/* Tips & Voice Practice Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div className="flex items-start gap-1.5 text-xs text-amber-900 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/60 flex-1">
          <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span><strong>Pro Tip:</strong> {q.tips}</span>
        </div>

        <Link
          href="/career-coach"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60 shrink-0 transition-colors"
        >
          <Mic className="h-3.5 w-3.5" /> Practice in Voice Coach →
        </Link>
      </div>
    </div>
  );
}
