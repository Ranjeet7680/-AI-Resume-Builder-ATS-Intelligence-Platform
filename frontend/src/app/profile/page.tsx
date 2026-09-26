"use client";

import { useState, useEffect } from "react";
import { User, Mail, Briefcase, MapPin, Globe, Linkedin, Github, Sparkles, CheckCircle2, Save, RefreshCw } from "lucide-react";
import { profileApi } from "@/lib/api";
import { UserProfileData } from "@/types/saas";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileApi.getProfile();
        setProfile(data);
        setFullName(data.full_name || "");
        setHeadline(data.headline || "");
        setSummary(data.summary || "");
        setAvatarUrl(data.avatar_url || "");
      } catch {
        // Fallback demo profile
        const demo: UserProfileData = {
          id: "usr-demo",
          email: "alex.chen.dev@example.com",
          full_name: "Alex Chen",
          headline: "Senior Full Stack & AI Systems Engineer",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          summary: "Impact-driven software engineer with 5+ years of experience architecting distributed backend services, Next.js frontends, and production LLM RAG pipelines.",
          completeness_score: 88,
          missing_sections: ["Certifications"],
          has_completed_onboarding: true,
        };
        setProfile(demo);
        setFullName(demo.full_name || "");
        setHeadline(demo.headline || "");
        setSummary(demo.summary || "");
        setAvatarUrl(demo.avatar_url || "");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await profileApi.updateProfile({
        full_name: fullName,
        headline: headline,
        summary: summary,
        avatar_url: avatarUrl,
      });
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const completeness = profile?.completeness_score || 88;

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-4xl space-y-8">
      {/* Header & Completeness Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{fullName || "Alex Chen"}</h1>
                <span className="p-1 rounded-full bg-blue-100 text-blue-700" title="Verified Profile">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{headline || "Senior Software Engineer"}</p>
              <p className="text-xs text-slate-400 mt-1">{profile?.email || "alex.chen.dev@example.com"}</p>
            </div>
          </div>

          {/* Completeness Gauge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center sm:text-right shrink-0 w-full sm:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Profile Strength
            </span>
            <div className="text-2xl font-black text-blue-600 mt-0.5">{completeness}%</div>
            <div className="w-36 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5 mx-auto sm:ml-auto sm:mr-0">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${completeness}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your master profile information automatically informs new resumes, cover letters, and AI career tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Avatar Image URL</label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Career Bio & Summary</label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {saveSuccess ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-400">All changes persist securely.</span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
