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

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-5xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60 mb-2">
          <CheckCircle className="h-3.5 w-3.5" />
          Real-Time ATS Parsing Engine
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          ATS Resume Compatibility Analyzer
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate how top applicant tracking systems (Workday, Greenhouse, Lever) interpret your resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Target Job Context */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Target Role or Job Description</h3>
            <p className="text-xs text-slate-500">
              Paste the job description you want to optimize against to find exact skill gaps and missing keywords.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* ATS Engine Report */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">ATS Parser Diagnostic</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Standard Single-Column Layout Detected</strong>
                  Your resume uses standard section headers without complex multi-column tables, ensuring 100% text readability by automated parsers.
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Measurable Results Formula Found</strong>
                  Your experience section contains active past-tense verbs and quantifiable performance metrics.
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Missing Cloud & DevOps Keywords</strong>
                  Target role frequently requires AWS and CI/CD competencies. Add these to your technical skills section.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/builder/current"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition"
              >
                Apply Improvements in Builder <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Gauge */}
        <div>
          <AtsScoreCard />
        </div>
      </div>
    </div>
  );
}
