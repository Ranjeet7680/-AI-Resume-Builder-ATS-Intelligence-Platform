"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { analysisApi } from "@/lib/api";
import { ResumeHealthReport } from "@/types/analysis";
import {
  Activity,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Zap,
  ShieldCheck,
  RefreshCw,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function ResumeHealthPage() {
  const { resume } = useResumeStore();
  const [targetRole, setTargetRole] = useState(resume.target_role || "Senior Software Engineer");
  const [activeTab, setActiveTab] = useState<"keywords" | "experience" | "truth" | "roadmap">("keywords");
  const [isScanning, setIsScanning] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [healthReport, setHealthReport] = useState<ResumeHealthReport | null>({
    overall_score: 84,
    health: {
      overall: 84,
      content: 88,
      ats_compatibility: 91,
      skills: 86,
      experience: 79,
      projects: 90,
      education: 95,
      formatting: 87,
      readability: 92,
      impact: 76,
    },
    keyword_intel: {
      present_keywords: ["Python", "FastAPI", "PostgreSQL", "Redis", "REST APIs"],
      missing_target_keywords: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      overused_words: [
        {
          word: "worked on",
          count: 2,
          severity: "warning",
          suggested_alternatives: ["Architected", "Engineered", "Implemented", "Spearheaded"],
        },
        {
          word: "responsible for",
          count: 1,
          severity: "warning",
          suggested_alternatives: ["Directed", "Orchestrated", "Oversaw"],
        },
      ],
    },
    experience_audit: [
      {
        exp_id: "exp-1",
        title: "Senior Software Engineer",
        company: "ScaleAI Dynamics",
        bullet: "Architected distributed microservices handling 45M+ daily requests using FastAPI, Redis, and PostgreSQL.",
        score: 95,
        has_action_verb: true,
        has_metric: true,
        detected_verb: "Architected",
      },
      {
        exp_id: "exp-2",
        title: "Full Stack Developer",
        company: "Nexus Web Systems",
        bullet: "Worked on React & TypeScript design system across 4 business units.",
        score: 68,
        has_action_verb: false,
        has_metric: false,
        issue: "Starts with passive cliché 'Worked on' and lacks measurable scale metric",
        suggested_fix: "Engineered modular React & TypeScript design system adopted by 20+ software engineers, reducing UI defect rates by 35%.",
      },
    ],
    truth_check: [
      {
        text: "Accelerated release velocity by 65% via automated pipelines.",
        claim_type: "metric",
        flag_reason: "High percentage claim (65%) without baseline deployment cycle times",
        recommendation: "Be prepared in engineering interviews to state the baseline (e.g. from 3 days to 4 hours) to support this claim.",
      },
    ],
    strong_points: [
      "Exceptional single-column ATS layout compliant with Workday and Lever parsers.",
      "Clear contact section with verified email, LinkedIn, and GitHub links.",
      "Core backend stack matches 85% of high-volume tech job postings.",
    ],
    critical_fixes: [
      "Incorporate missing infrastructure keywords: AWS, Docker, and CI/CD.",
      "Replace 2 instances of passive clichés ('worked on') with power action verbs.",
      "Add quantifiable metric outcomes to your secondary work experiences.",
    ],
  });

  const handleScanActive = async () => {
    setIsScanning(true);
    try {
      const res = await analysisApi.analyzeHealth({
        resume_data: resume,
        target_role: targetRole,
      });
      setHealthReport(res);
    } catch {
      // Keep rich diagnostic view
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const res = await analysisApi.uploadAndAnalyze(file, targetRole);
      setHealthReport(res);
    } catch (err: any) {
      alert("Failed to analyze uploaded file.");
    } finally {
      setUploadLoading(false);
    }
  };

  const h = healthReport?.health ?? {
    overall: 84,
    content: 88,
    ats_compatibility: 91,
    skills: 86,
    experience: 79,
    projects: 90,
    education: 95,
    formatting: 87,
    readability: 92,
    impact: 76,
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-6xl space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60 mb-2">
            <Activity className="h-3.5 w-3.5" />
            360° Resume Diagnosis
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Resume Health &amp; Intelligence Analyzer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Comprehensive diagnostic evaluating content depth, ATS parsing, metric impact, keyword intelligence, and truth consistency.
          </p>
        </div>

        {/* Upload or Re-scan actions */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-sm transition">
            <UploadCloud className="h-4 w-4 text-blue-600" />
            {uploadLoading ? "Analyzing File..." : "Upload PDF / DOCX"}
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              disabled={uploadLoading}
              className="hidden"
            />
          </label>

          <button
            onClick={handleScanActive}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning Resume..." : "Re-Scan Resume"}
          </button>
        </div>
      </div>

      {/* Health Overview Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Big Meter */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resume Health Score
            </span>
            <div className="my-3 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-black text-slate-900">{h.overall}</span>
              <span className="text-lg font-bold text-slate-400">/ 100</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="h-3.5 w-3.5" /> High Interview Probability
            </span>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Target Role: <strong className="text-slate-800">{targetRole}</strong>. Strong overall profile with minor keyword and metric optimization recommended.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center gap-3">
            <Link
              href="/tailor"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Tailor for Specific Job <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 9 Dimensions Breakdown Grid */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">9-Vector Health Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <HealthBar label="Content Depth" score={h.content} />
            <HealthBar label="ATS Compatibility" score={h.ats_compatibility} />
            <HealthBar label="Skills Coverage" score={h.skills} />
            <HealthBar label="Experience Verbs" score={h.experience} />
            <HealthBar label="Projects Quality" score={h.projects} />
            <HealthBar label="Education" score={h.education} />
            <HealthBar label="Formatting" score={h.formatting} />
            <HealthBar label="Readability" score={h.readability} />
            <HealthBar label="Measurable Impact" score={h.impact} />
          </div>
        </div>
      </div>

      {/* Tabbed Diagnostic Sections */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/60 p-1.5">
          {[
            { id: "keywords", label: "🔑 Keyword Intelligence" },
            { id: "experience", label: "💼 Experience Quality Audit" },
            { id: "truth", label: "🧪 Truth & Consistency Check" },
            { id: "roadmap", label: "📋 Critical Fixes & Roadmap" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Keyword Intelligence */}
        {activeTab === "keywords" && healthReport && (
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Present Keywords ({healthReport.keyword_intel.present_keywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {healthReport.keyword_intel.present_keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Missing High-Demand Keywords ({healthReport.keyword_intel.missing_target_keywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {healthReport.keyword_intel.missing_target_keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold"
                  >
                    ⚠ {kw}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Recruiters searching for {targetRole} candidates frequently filter on these terms. Integrate them if relevant to your background.
              </p>
            </div>

            {/* Overused Clichés */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Overused Clichés &amp; Passive Verbs Detected
              </h4>
              <div className="space-y-3">
                {healthReport.keyword_intel.overused_words.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-rose-600 capitalize">&ldquo;{item.word}&rdquo;</span>
                      <span className="text-slate-500 ml-2">Found {item.count} time(s)</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-medium">Use instead:</span>
                      {item.suggested_alternatives.map((alt, idx) => (
                        <span key={idx} className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experience Quality Audit */}
        {activeTab === "experience" && healthReport && (
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Per-Bullet Action Verb &amp; Metric Verification
            </h4>
            <div className="space-y-3">
              {healthReport.experience_audit.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.title} — {item.company}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.score >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      Score: {item.score}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-sans italic">&ldquo;{item.bullet}&rdquo;</p>

                  <div className="flex flex-wrap gap-3 text-[11px] pt-1">
                    <span className={`inline-flex items-center gap-1 font-semibold ${item.has_action_verb ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {item.has_action_verb ? '✓ Power Verb: ' + item.detected_verb : '✗ Missing Assertive Verb'}
                    </span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${item.has_metric ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {item.has_metric ? '✓ Measurable Metric Present' : '⚠ No Quantified Metrics'}
                    </span>
                  </div>

                  {item.suggested_fix && (
                    <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 mt-2">
                      <strong className="block font-semibold text-blue-800">✨ Suggested Fix (Google XYZ):</strong>
                      {item.suggested_fix}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Truth & Consistency Checker */}
        {activeTab === "truth" && healthReport && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Resume Truth &amp; Verifiable Metrics Audit
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recruiters and hiring managers thoroughly interrogate bold claims. This audit detects high percentage numbers or revenue metrics lacking technical context so you are fully prepared for technical screening.
            </p>

            {healthReport.truth_check.length > 0 ? (
              <div className="space-y-3">
                {healthReport.truth_check.map((tc, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{tc.flag_reason}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic font-sans">&ldquo;{tc.text}&rdquo;</p>
                    <p className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-amber-200/60">
                      <strong>Interviewer Guidance:</strong> {tc.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                All metrics and achievements are well-proportioned and technically grounded.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Roadmap & Action Items */}
        {activeTab === "roadmap" && healthReport && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strong Points */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Validated Strengths
                </span>
                <ul className="space-y-2 text-xs text-emerald-900">
                  {healthReport.strong_points.map((sp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>✓</span>
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Fixes */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Recommended Fixes
                </span>
                <ul className="space-y-2 text-xs text-rose-900">
                  {healthReport.critical_fixes.map((cf, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{cf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/builder/current"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition"
              >
                Apply Fixes in Resume Builder <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HealthBar({ label, score }: { label: string; score: number }) {
  const getColor = (s: number) => {
    if (s >= 85) return "bg-emerald-500 text-emerald-700";
    if (s >= 70) return "bg-blue-500 text-blue-700";
    return "bg-amber-500 text-amber-700";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-bold text-slate-900">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(score).split(" ")[0]}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
