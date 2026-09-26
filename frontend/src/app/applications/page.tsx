"use client";

import { useState, useEffect } from "react";
import { Plus, Briefcase, Calendar, MapPin, ExternalLink, Trash2, Edit3, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { applicationApi } from "@/lib/api";
import { JobApplicationItem } from "@/types/saas";

const STAGES = [
  { id: "saved", label: "Saved", color: "bg-slate-100 text-slate-700 border-slate-300" },
  { id: "applied", label: "Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "screening", label: "Screening", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "interview", label: "Interview", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "offer", label: "Offer Received", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "rejected", label: "Archived / Rejected", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Application Form
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("San Francisco, CA / Remote");
  const [salaryRange, setSalaryRange] = useState("$180k - $220k");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<"saved" | "applied" | "screening" | "interview" | "offer" | "rejected">("applied");
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split("T")[0]);
  const [interviewDate, setInterviewDate] = useState("");
  const [notes, setNotes] = useState("");

  const loadApplications = async () => {
    try {
      const data = await applicationApi.list();
      if (data && data.length > 0) {
        setApplications(data);
      } else {
        throw new Error("No applications");
      }
    } catch {
      // Fallback demo records
      setApplications([
        {
          id: "app-1",
          user_id: "usr-1",
          company: "ScaleAI Dynamics",
          role: "Senior AI Systems Engineer",
          location: "San Francisco, CA",
          salary_range: "$190k - $240k",
          status: "interview",
          applied_date: "2026-09-12",
          interview_date: "2026-09-28",
          notes: "Round 2 Systems Design interview with VP of Engineering.",
          resume_version_name: "AI & ML Engineer Specialist",
        },
        {
          id: "app-2",
          user_id: "usr-1",
          company: "Anthropic AI",
          role: "Staff Platform Engineer",
          location: "Remote / Hybrid",
          salary_range: "$220k - $275k",
          status: "applied",
          applied_date: "2026-09-20",
          notes: "Referred by alumni connection on LinkedIn.",
          resume_version_name: "ATS Minimalist",
        },
        {
          id: "app-3",
          user_id: "usr-1",
          company: "Stripe",
          role: "Distributed Infrastructure Engineer",
          location: "San Francisco, CA",
          salary_range: "$200k - $250k",
          status: "offer",
          applied_date: "2026-09-02",
          interview_date: "2026-09-18",
          notes: "Official offer packet received! Reviewing equity package.",
          resume_version_name: "Software Engineer Pro",
        },
        {
          id: "app-4",
          user_id: "usr-1",
          company: "Databricks",
          role: "Data Platform Engineer",
          location: "Seattle, WA / Remote",
          salary_range: "$195k - $235k",
          status: "saved",
          applied_date: "2026-09-25",
          notes: "Need to tailor resume for Spark and Lakehouse keywords.",
          resume_version_name: "Data Scientist Analytics",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await applicationApi.create({
        company,
        role,
        location,
        salary_range: salaryRange,
        job_url: jobUrl,
        status,
        applied_date: appliedDate,
        interview_date: interviewDate,
        notes,
      });
      setApplications([created, ...applications]);
    } catch {
      // Offline fallback
      const localRecord: JobApplicationItem = {
        id: `app-local-${Date.now()}`,
        user_id: "usr-demo",
        company,
        role,
        location,
        salary_range: salaryRange,
        job_url: jobUrl,
        status,
        applied_date: appliedDate,
        interview_date: interviewDate,
        notes,
      };
      setApplications([localRecord, ...applications]);
    } finally {
      setShowAddModal(false);
      setCompany("");
      setRole("");
      setNotes("");
    }
  };

  const handleStatusChange = async (
    appId: string,
    newStatus: "saved" | "applied" | "screening" | "interview" | "offer" | "rejected"
  ) => {
    const updated = applications.map((a) =>
      a.id === appId ? { ...a, status: newStatus } : a
    );
    setApplications(updated);
    try {
      await applicationApi.update(appId, { status: newStatus });
    } catch {
      // Local state already updated
    }
  };

  const handleDelete = async (appId: string) => {
    setApplications(applications.filter((a) => a.id !== appId));
    try {
      await applicationApi.delete(appId);
    } catch {
      // Local state already updated
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-600 text-white rounded-xl">
                <Briefcase className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">Job Application Tracker</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Organize your job search funnel, track interview rounds, and link each application to the specific resume version used.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Application
          </button>
        </div>

        {/* Funnel Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
          {STAGES.map((st) => {
            const count = applications.filter((a) => a.status === st.id).length;
            return (
              <div key={st.id} className={`p-3 rounded-xl border ${st.color} text-center`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                  {st.label}
                </span>
                <span className="text-xl font-black">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
        {STAGES.map((stage) => {
          const stageApps = applications.filter((a) => a.status === stage.id);
          return (
            <div
              key={stage.id}
              className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3 space-y-3 min-h-[480px]"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {stage.label}
                </span>
                <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                  {stageApps.length}
                </span>
              </div>

              {stageApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2 hover:border-blue-400 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{app.company}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">{app.role}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-slate-300 hover:text-rose-600 p-1"
                      title="Delete application"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {app.location && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {app.location}
                    </div>
                  )}

                  {app.salary_range && (
                    <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                      {app.salary_range}
                    </div>
                  )}

                  {app.interview_date && (
                    <div className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <Calendar className="h-3 w-3" /> Interview: {app.interview_date}
                    </div>
                  )}

                  {app.notes && (
                    <p className="text-[10px] text-slate-500 italic border-t border-slate-100 pt-1.5">
                      &ldquo;{app.notes}&rdquo;
                    </p>
                  )}

                  {/* Stage Switcher Dropdown */}
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Stage:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                      className="text-[10px] p-1 rounded border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add New Job Application</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Anthropic AI"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Staff Systems Engineer"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Application Date</label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes & Next Steps</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Recruiter call scheduled, tailored for Redis and pgvector"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
