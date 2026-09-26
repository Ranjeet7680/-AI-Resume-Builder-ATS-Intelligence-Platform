import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3, FileCheck, Linkedin, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Career Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Land 3x More Interviews with an{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ATS-Optimized Resume
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Import your career history seamlessly with LinkedIn. Enhance bullet points with the proven Google XYZ formula, run real-time ATS compatibility scoring, and match against target job descriptions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
            >
              <Linkedin className="h-4 w-4" />
              Continue with LinkedIn
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tailor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition"
            >
              <Target className="h-4 w-4" />
              Paste Job Description ➔ AI Tailor
            </Link>
            <Link
              href="/builder/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Live Builder Sandbox
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Privacy & Factual Integrity
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-600" />
              Single-Column ATS Parsable
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-indigo-600" />
              Instant PDF & Word Export
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Engineered for Serious Job Seekers & Tech Professionals
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Transform passive job descriptions into measurable achievements recruiters notice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <Linkedin className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">LinkedIn Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect via OAuth or upload your exported profile PDF to hydrate work experience, degrees, and skills in seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">XYZ Formula Rewriter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refactor &ldquo;I built a website with React&rdquo; into &ldquo;Developed a responsive React web app, optimizing component reusability and load times.&rdquo;
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">ATS Scoring & Gap Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan your resume against real applicant tracking system criteria. Identify missing keywords, action verb ratios, and formatting flaws.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
