"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { CheckCircle, AlertTriangle, RefreshCw, Sparkles, FileSearch } from "lucide-react";

export default function AtsScoreCard() {
  const { resume, atsAnalysis, isAnalyzingAts, runAtsAnalysis } = useResumeStore();

  const score = atsAnalysis?.overall_score ?? resume.ats_score ?? 85;
  const breakdown = atsAnalysis?.breakdown ?? {
    keywords: 90,
    skills: 88,
    experience: 84,
    formatting: 95,
    achievements: 72,
  };

  const missingKeywords = atsAnalysis?.missing_keywords?.length
    ? atsAnalysis.missing_keywords
    : ["AWS", "Kubernetes", "GraphQL"];

  const suggestions = atsAnalysis?.suggestions?.length
    ? atsAnalysis.suggestions
    : [
        "Include more quantifiable metrics (%, $, user volume) across experience bullets.",
        "Add explicit cloud architecture skills to pass recruiter filters.",
      ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
      {/* Header & Score Gauge */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ATS Compatibility Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-slate-900">{score}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
        </div>

        <button
          onClick={runAtsAnalysis}
          disabled={isAnalyzingAts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzingAts ? "animate-spin" : ""}`} />
          {isAnalyzingAts ? "Analyzing..." : "Re-Scan"}
        </button>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <ScoreBar label="Keywords Match" score={breakdown.keywords} />
        <ScoreBar label="Skills Coverage" score={breakdown.skills} />
        <ScoreBar label="Experience Verbs" score={breakdown.experience} />
        <ScoreBar label="Formatting & Headers" score={breakdown.formatting} />
        <ScoreBar label="Measurable Metrics" score={breakdown.achievements} />
      </div>

      {/* Missing Keywords */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-700 block mb-2">
          Recommended Missing Keywords:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {missingKeywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800 border border-amber-200/60"
            >
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <span className="text-xs font-semibold text-slate-700 block">AI Suggestions:</span>
        <ul className="space-y-1.5">
          {suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getColor = (val: number) => {
    if (val >= 85) return "bg-emerald-500";
    if (val >= 70) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-semibold text-slate-900">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(score)}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
