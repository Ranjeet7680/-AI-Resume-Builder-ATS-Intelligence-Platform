"use client";

import { useState } from "react";
import AtsScoreCard from "@/components/ats/AtsScoreCard";
import { CheckCircle, AlertTriangle, Sparkles, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useResumeStore } from "@/store/useResumeStore";

export default function AtsAnalyzerPage() {
  const { resume } = useResumeStore();
  const [jobDescription, setJobDescription] = useState(
    "We are seeking a Senior Backend Engineer proficient in Python, FastAPI, PostgreSQL, Redis, Docker, and AWS. Ideal candidates have experience architecting microservices and leading CI/CD deployments."
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-8 max-w-5xl space-y-8 animate-fade-in-up">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 mb-2">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
          Real-Time ATS Parsing Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          ATS Resume Compatibility Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate how top applicant tracking systems (Workday, Greenhouse, Lever, Taleo) interpret your resume.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Target Job Context */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Target Role or Job Description</h3>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 self-start sm:self-auto"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isScanning ? "Simulating ATS Parsing..." : "Re-Scan Match"}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste the job description you want to optimize against to find exact skill gaps and missing keywords.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3.5 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-sans transition-all"
            />

            {/* Keyword Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Detected Keywords:</span>
              {["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS", "CI/CD"].map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Scanning Animation Progress Bar */}
          {isScanning && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Workday, Greenhouse &amp; Lever Simulation in progress...
                </span>
                <span>Analyzing headers &amp; weights</span>
              </div>
              <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[85%] rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* ATS Engine Report */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">ATS Parser Diagnostic</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <strong className="block font-bold">Standard Single-Column Layout Detected</strong>
                  Your resume uses standard section headers without complex multi-column tables, ensuring 100% text readability by automated parsers.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
                <Sparkles className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                <div>
                  <strong className="block font-bold">Measurable Results Formula Found</strong>
                  Your experience section contains active past-tense verbs and quantifiable performance metrics.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="block font-bold">Missing Cloud &amp; DevOps Keywords</strong>
                  Target role frequently requires AWS and CI/CD competencies. Add these to your technical skills section.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/builder/current"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
              >
                Apply Improvements in Builder <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Gauge */}
        <div className="lg:sticky lg:top-24">
          <AtsScoreCard />
        </div>
      </div>
    </div>
  );
}
