"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Check, Compass, Briefcase, Code, MapPin, Linkedin, Github, Upload, RefreshCw } from "lucide-react";
import { profileApi } from "@/lib/api";

const GOALS = [
  { id: "internship", label: "Internship", desc: "College students seeking summer or off-cycle internships", icon: "🎓" },
  { id: "first_job", label: "First Job", desc: "Recent college grads entering the professional workforce", icon: "🚀" },
  { id: "job_switch", label: "Job Switch", desc: "Mid/Senior professionals targeting higher comp and impact", icon: "💼" },
  { id: "freelancing", label: "Freelancing", desc: "Independent consultants and high-skill contractors", icon: "🌐" },
  { id: "higher_studies", label: "Higher Studies", desc: "Master's or PhD candidates targeting academic positions", icon: "📚" },
  { id: "career_exploration", label: "Career Exploration", desc: "Exploring emerging domains like GenAI and Data Science", icon: "🧭" },
];

const POPULAR_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "FastAPI",
  "SQL", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Machine Learning",
  "PyTorch", "LLMs", "pgvector", "Git", "System Design", "CI/CD"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedGoal, setSelectedGoal] = useState("job_switch");
  const [targetRole, setTargetRole] = useState("Senior Full Stack & AI Engineer");
  const [experienceLevel, setExperienceLevel] = useState("experienced");
  const [industry, setIndustry] = useState("Technology");
  const [locationPreference, setLocationPreference] = useState("Remote / Hybrid");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Python", "TypeScript", "React", "FastAPI", "Docker", "PostgreSQL"
  ]);
  const [customSkill, setCustomSkill] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/alexchen");
  const [githubUrl, setGithubUrl] = useState("https://github.com/alexchen");

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customSkill.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(customSkill.trim())) {
        setSelectedSkills([...selectedSkills, customSkill.trim()]);
      }
      setCustomSkill("");
    }
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      await profileApi.completeOnboarding({
        goal: selectedGoal,
        target_role: targetRole,
        experience_level: experienceLevel,
        industry: industry,
        location_preference: locationPreference,
        skills: selectedSkills,
        linkedin_url: linkedinUrl || undefined,
        github_url: githubUrl || undefined,
      });
      router.push("/dashboard");
    } catch {
      // Fallback
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Personalize Career Workspace</span>
              <span className="text-slate-400 text-xs block">Step {step} of 3</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s
                    ? "w-8 bg-blue-600"
                    : step > s
                    ? "w-4 bg-emerald-500"
                    : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: CAREER GOAL */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900">What are you looking for?</h2>
              <p className="text-xs text-slate-500 mt-1">
                We customize ATS criteria, AI suggestions, and template priorities based on your career trajectory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    selectedGoal === g.id
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{g.label}</span>
                    <span className="text-slate-500 text-xs leading-relaxed">{g.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow hover:bg-blue-700 transition"
              >
                Next: Role & Preferences <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE & PREFERENCES */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Define your target position</h2>
              <p className="text-xs text-slate-500 mt-1">
                Our AI aligns keyword parsing and template hierarchy to this target specification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="student">Student / Campus Placement</option>
                  <option value="fresher">Fresher (0 - 1 years)</option>
                  <option value="mid">Mid-Level (2 - 5 years)</option>
                  <option value="senior">Senior (5 - 8 years)</option>
                  <option value="lead">Staff / Lead / Executive (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Technology">Technology & SaaS</option>
                  <option value="AI & Data Science">AI, GenAI & Data Science</option>
                  <option value="Finance & Fintech">Finance, Banking & Fintech</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Healthcare">Healthcare & BioTech</option>
                  <option value="Consulting">Consulting & Strategy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location Preference</label>
                <input
                  type="text"
                  value={locationPreference}
                  onChange={(e) => setLocationPreference(e.target.value)}
                  placeholder="e.g. Remote / Bengaluru / San Francisco"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow hover:bg-blue-700 transition"
              >
                Next: Skills & Integrations <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SKILLS & INTEGRATIONS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Technical Skills & Profile Sync</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your core stack and connect your developer profiles to auto-populate achievements.
              </p>
            </div>

            {/* Skills selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Core Skills ({selectedSkills.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {POPULAR_SKILLS.map((sk) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      type="button"
                      key={sk}
                      onClick={() => toggleSkill(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {sk}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                placeholder="Type additional skill and press Enter..."
                className="w-full mt-2 text-xs p-2 rounded-lg border border-slate-200"
              />
            </div>

            {/* Profile links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                  <Linkedin className="h-3.5 w-3.5 text-[#0077b5]" /> LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                  <Github className="h-3.5 w-3.5 text-slate-900" /> GitHub Profile
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Building Career Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Build My Career Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
