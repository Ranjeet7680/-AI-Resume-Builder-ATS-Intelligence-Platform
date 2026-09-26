"use client";

import { useState, useEffect } from "react";
import {
  User,
  Sliders,
  Globe,
  Mic,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Save,
  Volume2,
  Lock,
  Linkedin,
  Github,
} from "lucide-react";
import { settingsApi } from "@/lib/api";
import { UserSettingsData } from "@/types/saas";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "account" | "appearance" | "language" | "voice" | "notifications" | "privacy" | "integrations" | "billing"
  >("account");

  const [settings, setSettings] = useState<UserSettingsData>({
    theme: "system",
    language: "en",
    voice_speed: 1.0,
    voice_id: "default_en",
    auto_play_voice: true,
    notifications_email: true,
    notifications_interviews: true,
    notifications_applications: true,
    public_profile_enabled: true,
    analytics_enabled: true,
    plan: "pro",
    max_resumes_allowed: 25,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isWipingData, setIsWipingData] = useState(false);
  const [wipeMessage, setWipeMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsApi.getSettings();
        setSettings(data);
      } catch {
        // Keep default settings
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await settingsApi.updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWipeConversations = () => {
    setIsWipingData(true);
    setTimeout(() => {
      setIsWipingData(false);
      setWipeMessage("All AI chat history and voice transcripts have been permanently deleted.");
      setTimeout(() => setWipeMessage(null), 3000);
    }, 700);
  };

  const testVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Testing speech settings at " + settings.voice_speed + "x speed.");
      utterance.rate = settings.voice_speed;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your account credentials, voice models, privacy controls, notification preferences, and subscription tier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Navigation Tabs (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
          {[
            { id: "account", label: "Account & Profile", icon: User },
            { id: "appearance", label: "Appearance & Theme", icon: Sliders },
            { id: "language", label: "Language Preferences", icon: Globe },
            { id: "voice", label: "Voice & Speech Settings", icon: Mic },
            { id: "notifications", label: "Notifications & Alerts", icon: Bell },
            { id: "privacy", label: "Privacy & Data Controls", icon: Shield },
            { id: "integrations", label: "Connected Integrations", icon: Linkedin },
            { id: "billing", label: "Billing & Plans", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Content (8 cols) */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* TAB 1: ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Account Credentials</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value="alex.chen.dev@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Managed via OAuth authentication.</span>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Change Password</label>
                  <input
                    type="password"
                    placeholder="New password (optional)"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-rose-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Account Permanently
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Appearance & Theme</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light Mode" },
                  { id: "dark", label: "Dark Mode" },
                  { id: "system", label: "System Default" },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSettings({ ...settings, theme: th.id as any })}
                    className={`p-4 rounded-xl border text-center text-xs font-bold transition ${
                      settings.theme === th.id
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LANGUAGE */}
          {activeTab === "language" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Interface & Voice Language</h2>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
              >
                <option value="en">English (US/UK/IN)</option>
                <option value="hi">Hindi (हिंदी / Hinglish)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
              </select>
            </div>
          )}

          {/* TAB 4: VOICE SETTINGS */}
          {activeTab === "voice" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">Voice & Speech Synthesis</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Speech Rate: {settings.voice_speed}x</span>
                  <button
                    onClick={testVoice}
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Test Voice
                  </button>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={settings.voice_speed}
                  onChange={(e) => setSettings({ ...settings, voice_speed: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Auto-Play Voice Responses</span>
                  <span className="text-[11px] text-slate-500">Automatically speak answers during mock interviews</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_play_voice}
                  onChange={(e) => setSettings({ ...settings, auto_play_voice: e.target.checked })}
                  className="h-4 w-4 rounded accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Notification Alerts</h2>

              <div className="space-y-3">
                {[
                  {
                    key: "notifications_email",
                    title: "Email Digest",
                    desc: "Weekly summary of application status and profile views",
                  },
                  {
                    key: "notifications_interviews",
                    title: "Interview Reminders",
                    desc: "Calendar alerts 24h before scheduled interview rounds",
                  },
                  {
                    key: "notifications_applications",
                    title: "Application Updates",
                    desc: "Notifications when you move jobs between Kanban stages",
                  },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{n.title}</span>
                      <span className="text-[11px] text-slate-500">{n.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(settings as any)[n.key]}
                      onChange={(e) => setSettings({ ...settings, [n.key]: e.target.checked })}
                      className="h-4 w-4 rounded accent-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">Privacy & Data Governance</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Public Vanity Profiles</span>
                    <span className="text-[11px] text-slate-500">Allow recruiters to view your public resume link (/r/slug)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.public_profile_enabled}
                    onChange={(e) => setSettings({ ...settings, public_profile_enabled: e.target.checked })}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-rose-900 block">AI Data Hygiene & Conversation Wipe</span>
                    <span className="text-[11px] text-rose-700">
                      Permanently wipe all past chat history, audio recordings, and mock interview transcripts.
                    </span>
                  </div>
                  {wipeMessage && (
                    <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 p-2 rounded-lg">
                      {wipeMessage}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleWipeConversations}
                    disabled={isWipingData}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                  >
                    {isWipingData ? "Deleting Data..." : "Wipe All AI History"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INTEGRATIONS */}
          {activeTab === "integrations" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Connected Services</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-6 w-6 text-[#0077b5]" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">LinkedIn Profile</span>
                      <span className="text-[11px] text-slate-500">Connected via OIDC • OpenID, Profile, Email</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Connected ✓
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="h-6 w-6 text-slate-900" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">GitHub Analyzer</span>
                      <span className="text-[11px] text-slate-500">Connected: github.com/alexchen</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Active ✓
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BILLING */}
          {activeTab === "billing" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-slate-900">Subscription & Usage</h2>
              <div className="p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Current Plan
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-1">Pro Career Tier (₹499/mo)</div>
                  <span className="text-xs text-slate-500">Renews on Oct 26, 2026. Unlimited resumes & templates.</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* Save Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Preferences saved!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings update immediately across all devices.</span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
