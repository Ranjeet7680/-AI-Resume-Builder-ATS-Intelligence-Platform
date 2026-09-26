"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import ResumePreview from "@/components/resume/ResumePreview";
import AtsScoreCard from "@/components/ats/AtsScoreCard";
import AiAssistantModal from "@/components/resume/AiAssistantModal";
import StarBuilderModal from "@/components/resume/StarBuilderModal";
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Compass,
  Share2,
  Check,
  ExternalLink,
} from "lucide-react";
import { resumeApi } from "@/lib/api";

export default function ResumeBuilderPage() {
  const {
    resume,
    activeSection,
    setActiveSection,
    updatePersonalInfo,
    updateTargetRole,
    setTemplate,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
  } = useResumeStore();

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [starModalOpen, setStarModalOpen] = useState(false);
  const [selectedBulletInfo, setSelectedBulletInfo] = useState<{ expId: string; bulletIndex: number; text: string } | null>(null);
  const [selectedExpForStar, setSelectedExpForStar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [candidateMode, setCandidateMode] = useState<"experienced" | "fresher">("experienced");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  const openAiEnhancer = (expId: string, bulletIndex: number, text: string) => {
    setSelectedBulletInfo({ expId, bulletIndex, text });
    setAiModalOpen(true);
  };

  const openStarBuilder = (expId: string) => {
    setSelectedExpForStar(expId);
    setStarModalOpen(true);
  };

  const applyImprovedBullet = (improvedText: string) => {
    if (selectedBulletInfo) {
      updateExperienceBullet(selectedBulletInfo.expId, selectedBulletInfo.bulletIndex, improvedText);
    }
    setAiModalOpen(false);
  };

  const applyStarBullet = (bullet: string) => {
    if (selectedExpForStar) {
      addExperienceBullet(selectedExpForStar, bullet);
    }
    setStarModalOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      if (resume.id && resume.id !== "new") {
        await resumeApi.update(resume.id, resume);
      } else {
        const created = await resumeApi.create(resume);
        if (created.id) resume.id = created.id;
      }
      setSaveMessage("Saved successfully!");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch {
      setSaveMessage("Saved locally!");
      setTimeout(() => setSaveMessage(null), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareLink = () => {
    const slug = resume.public_slug || resume.id || "sample-resume-1";
    const shareUrl = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Top Builder Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => useResumeStore.setState((s) => ({ resume: { ...s.resume, title: e.target.value } }))}
            className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1"
          />
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Target Role:</span>
            <input
              type="text"
              value={resume.target_role}
              onChange={(e) => updateTargetRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="font-medium text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mode Selector (Fresher vs Experienced) */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setCandidateMode("experienced")}
              className={`px-2.5 py-1 rounded-md transition ${
                candidateMode === "experienced"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Experienced
            </button>
            <button
              onClick={() => setCandidateMode("fresher")}
              className={`px-2.5 py-1 rounded-md transition ${
                candidateMode === "fresher"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fresher / Student
            </button>
          </div>

          {/* Template Selector */}
          <select
            value={resume.template_id}
            onChange={(e) => setTemplate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="modern-ats">Modern ATS (Single Column)</option>
            <option value="minimalist">Minimalist</option>
            <option value="tech">Tech Engineer</option>
            <option value="executive">Executive</option>
          </select>

          {/* Public Share Link */}
          <button
            onClick={handleShareLink}
            title="Copy Public Shareable Resume URL"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            {copiedLink ? "Link Copied!" : "Share URL"}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : saveMessage || "Save"}
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher: Form Editor vs Live Preview & ATS */}
      <div className="lg:hidden flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-1 shadow-xs border border-slate-200 dark:border-slate-700 w-full">
          <button
            onClick={() => setMobileView("editor")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileView === "editor"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            📝 Form Editor
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileView === "preview"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            👁️ Preview & ATS Score
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Editor */}
        <div
          className={`${
            mobileView === "editor" ? "flex" : "hidden"
          } lg:flex w-full lg:w-1/2 flex-col border-r border-slate-200 bg-white overflow-hidden`}
        >
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/60 p-1">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "experience", label: candidateMode === "fresher" ? "Internships & Exp" : "Experience", icon: Briefcase },
              { id: "projects", label: candidateMode === "fresher" ? "⭐ Key Projects" : "Projects", icon: FolderGit2 },
              { id: "skills", label: "Skills", icon: Wrench },
              { id: "education", label: candidateMode === "fresher" ? "⭐ Education" : "Education", icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Profile Tab */}
            {activeSection === "profile" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Personal & Contact Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Full Name</label>
                    <input
                      type="text"
                      value={resume.personal_info.fullName}
                      onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Professional Headline</label>
                    <input
                      type="text"
                      value={resume.personal_info.headline}
                      onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Email Address</label>
                    <input
                      type="email"
                      value={resume.personal_info.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Phone</label>
                    <input
                      type="text"
                      value={resume.personal_info.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Location</label>
                    <input
                      type="text"
                      value={resume.personal_info.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={resume.personal_info.linkedin || ""}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">Professional Summary</label>
                  <textarea
                    value={resume.personal_info.summary}
                    onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                    rows={4}
                    className="w-full mt-1 p-3 text-xs border border-slate-300 rounded-lg outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      {candidateMode === "fresher" ? "Internships & Roles" : "Work Experience"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Use the STAR builder to structure achievements into action verbs and measurable results.
                    </p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Position
                  </button>
                </div>

                {resume.experiences.map((exp) => (
                  <div key={exp.id} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/30">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 gap-2 flex-1 mr-4">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                          placeholder="Job Title"
                          className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Company"
                          className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                        />
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Bullets List */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase text-slate-500">Key Achievements</span>
                        <button
                          onClick={() => openStarBuilder(exp.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60"
                        >
                          <Compass className="h-3 w-3" /> Guided STAR Builder
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIndex) => (
                        <div key={bIndex} className="flex items-start gap-2">
                          <textarea
                            value={bullet}
                            onChange={(e) => updateExperienceBullet(exp.id, bIndex, e.target.value)}
                            rows={2}
                            className="flex-1 p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-sans"
                          />
                          <button
                            onClick={() => openAiEnhancer(exp.id, bIndex, bullet)}
                            title="Enhance with AI (Google XYZ Formula)"
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => removeExperienceBullet(exp.id, bIndex)}
                            className="p-2 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addExperienceBullet(exp.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 pt-1"
                      >
                        <Plus className="h-3 w-3" /> Add Achievement Bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Tab */}
            {activeSection === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Technical Projects
                  </h3>
                  <button
                    onClick={() =>
                      useResumeStore.setState((s) => ({
                        resume: {
                          ...s.resume,
                          projects: [
                            {
                              id: `proj-${Date.now()}`,
                              title: "New Project",
                              description: "Project summary and architecture.",
                              technologies: ["React", "FastAPI"],
                              link: "https://github.com",
                              bullets: ["Built scalable prototype delivering core requirements."],
                            },
                            ...s.resume.projects,
                          ],
                        },
                      }))
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </button>
                </div>

                {resume.projects.map((proj, pIndex) => (
                  <div key={proj.id} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/30">
                    <div className="flex justify-between items-start">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[pIndex].title = e.target.value;
                          useResumeStore.setState((s) => ({ resume: { ...s.resume, projects: updated } }));
                        }}
                        placeholder="Project Title"
                        className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg flex-1 mr-3"
                      />
                      <button
                        onClick={() => {
                          const updated = resume.projects.filter((_, i) => i !== pIndex);
                          useResumeStore.setState((s) => ({ resume: { ...s.resume, projects: updated } }));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.technologies.join(", ")}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[pIndex].technologies = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                        useResumeStore.setState((s) => ({ resume: { ...s.resume, projects: updated } }));
                      }}
                      placeholder="Technologies (e.g. Python, FastAPI, Docker)"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                    />

                    <textarea
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[pIndex].description = e.target.value;
                        useResumeStore.setState((s) => ({ resume: { ...s.resume, projects: updated } }));
                      }}
                      rows={2}
                      placeholder="Brief overview of the technical challenge solved."
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-lg font-sans"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Skills Tab */}
            {activeSection === "skills" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Technical Skills</h3>
                {resume.skills.map((cat, i) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-xs font-semibold text-slate-800">{cat.category}</span>
                    <input
                      type="text"
                      value={cat.items.join(", ")}
                      onChange={(e) =>
                        useResumeStore.getState().updateSkillCategory(
                          i,
                          cat.category,
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="e.g. Python, FastAPI, Docker, PostgreSQL"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeSection === "education" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Education</h3>
                {resume.education.map((edu, eIndex) => (
                  <div key={edu.id} className="p-4 border border-slate-200 rounded-xl space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[eIndex].institution = e.target.value;
                          useResumeStore.setState((s) => ({ resume: { ...s.resume, education: updated } }));
                        }}
                        placeholder="Institution"
                        className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[eIndex].degree = e.target.value;
                          useResumeStore.setState((s) => ({ resume: { ...s.resume, education: updated } }));
                        }}
                        placeholder="Degree & Major"
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: ATS Score & Live Preview */}
        <div
          className={`${
            mobileView === "preview" ? "flex" : "hidden"
          } lg:flex w-full lg:w-1/2 flex-col bg-slate-100 p-3 sm:p-4 gap-4 overflow-y-auto`}
        >
          {/* ATS Gauge Widget */}
          <AtsScoreCard />

          {/* Dynamic Preview Canvas */}
          <div className="flex-1 min-h-[700px]">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={applyImprovedBullet}
        defaultText={selectedBulletInfo?.text || ""}
        targetRole={resume.target_role}
      />

      {/* Guided STAR Builder Modal */}
      <StarBuilderModal
        isOpen={starModalOpen}
        onClose={() => setStarModalOpen(false)}
        onApply={applyStarBullet}
        defaultRole={resume.target_role}
      />
    </div>
  );
}
