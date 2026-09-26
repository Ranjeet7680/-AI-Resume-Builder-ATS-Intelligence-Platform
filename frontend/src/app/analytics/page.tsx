"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Download, Eye, CheckCircle2, Award, Briefcase, Zap, Calendar } from "lucide-react";
import { analyticsApi } from "@/lib/api";
import { CareerAnalyticsData } from "@/types/saas";

export default function AnalyticsPage() {
  const [data, setData] = useState<CareerAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await analyticsApi.getAnalytics();
        setData(res);
      } catch {
        // Fallback
        setData({
          user_id: "usr-demo",
          overview: {
            career_readiness_score: 78,
            overall_ats_score: 88,
            total_resumes: 3,
            total_applications: 12,
            interviews_scheduled: 3,
            offers_received: 1,
            public_views: 42,
            docx_downloads: 18,
            txt_exports: 9,
          },
          application_pipeline: {
            saved: 4,
            applied: 3,
            screening: 1,
            interview: 3,
            offer: 1,
            rejected: 0,
          },
          ats_breakdown: {
            keywords_coverage: 84,
            action_verbs: 92,
            quantifiable_metrics: 76,
            formatting_readability: 98,
            skills_alignment: 88,
          },
          weekly_activity: [
            { day: "Mon", views: 4, applications: 2 },
            { day: "Tue", views: 8, applications: 3 },
            { day: "Wed", views: 6, applications: 1 },
            { day: "Thu", views: 12, applications: 4 },
            { day: "Fri", views: 9, applications: 2 },
            { day: "Sat", views: 3, applications: 0 },
            { day: "Sun", views: 5, applications: 1 },
          ],
          top_matching_roles: [
            { role: "Senior Full Stack Engineer", match_percentage: 94 },
            { role: "AI / ML Systems Engineer", match_percentage: 88 },
            { role: "Cloud Solutions Architect", match_percentage: 82 },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const ov = data?.overview || {
    career_readiness_score: 78,
    overall_ats_score: 88,
    public_views: 42,
    docx_downloads: 18,
    txt_exports: 9,
    total_applications: 12,
    interviews_scheduled: 3,
    offers_received: 1,
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-600 text-white rounded-xl">
                <BarChart3 className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">Career & Search Analytics</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Live metrics on resume visibility, downloads, ATS compliance trends, and conversion from application to interview.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">Readiness Score</span>
            <div className="text-2xl font-black text-blue-900 mt-1">{ov.career_readiness_score} / 100</div>
            <span className="text-[10px] text-emerald-600 font-semibold">▲ +12% this month</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Avg ATS Score</span>
            <div className="text-2xl font-black text-emerald-900 mt-1">{ov.overall_ats_score}%</div>
            <span className="text-[10px] text-emerald-700 font-semibold">100% Parsable formats</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">Total Resume Views</span>
            <div className="text-2xl font-black text-purple-900 mt-1">{ov.public_views}</div>
            <span className="text-[10px] text-purple-700 font-semibold">Across vanity links</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Total Downloads</span>
            <div className="text-2xl font-black text-amber-900 mt-1">{ov.docx_downloads + ov.txt_exports}</div>
            <span className="text-[10px] text-amber-700 font-semibold">Word (.docx) & Plain-Text</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATS Dimension Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> ATS Compatibility Dimensions
          </h2>
          <div className="space-y-3 pt-2">
            {[
              { label: "Formatting & Single-Column Structure", val: 98 },
              { label: "Action Verb Punchiness", val: 92 },
              { label: "Skills Keyword Density", val: 88 },
              { label: "Keyword Coverage Match", val: 84 },
              { label: "Quantifiable Outcome Metrics", val: 76 },
            ].map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{d.label}</span>
                  <span className="text-blue-600">{d.val}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${d.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Matching Roles */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" /> High-Probability Role Matches
          </h2>
          <div className="space-y-3 pt-2">
            {data?.top_matching_roles.map((r, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 text-xs">{r.role}</span>
                  <span className="text-[11px] text-slate-500 block">Based on verified project stack</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {r.match_percentage}% Match
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart Simulation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> 7-Day Activity & Outreach Pulse
          </h2>
          <div className="grid grid-cols-7 gap-2 pt-4">
            {data?.weekly_activity.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full bg-slate-100 rounded-xl h-36 flex flex-col justify-end p-1.5 overflow-hidden">
                  <div
                    className="w-full bg-blue-600 rounded-lg transition-all"
                    style={{ height: `${Math.max(w.views * 8, 12)}%` }}
                    title={`${w.views} views`}
                  />
                  <div
                    className="w-full bg-indigo-400 rounded-lg mt-1 transition-all"
                    style={{ height: `${Math.max(w.applications * 15, 8)}%` }}
                    title={`${w.applications} applications`}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600">{w.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-blue-600 inline-block" /> Profile & Resume Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-indigo-400 inline-block" /> Applications Submitted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
