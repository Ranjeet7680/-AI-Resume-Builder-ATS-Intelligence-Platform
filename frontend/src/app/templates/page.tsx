"use client";

import { useState, useEffect } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { templateApi, exportApi } from "@/lib/api";
import {
  TemplateMetadata,
  TemplateRecommendationResponse,
  Create5VersionsResponse,
} from "@/types/template";
import ResumePreview from "@/components/resume/ResumePreview";
import {
  Sparkles,
  Layers,
  CheckCircle,
  AlertTriangle,
  Download,
  Copy,
  Printer,
  Sliders,
  Type,
  Palette,
  Layout,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
  Check,
  Zap,
} from "lucide-react";

// Fallback templates in case backend is offline
const FALLBACK_TEMPLATES: TemplateMetadata[] = [
  {
    id: "ats-minimal",
    name: "ATS Minimalist",
    category: "ats",
    description: "Ultra-clean single column layout parsed flawlessly by Workday, Taleo, and Greenhouse.",
    ats_score: 100,
    is_ats_guaranteed: true,
    preview_tag: "Max ATS Compatibility",
    recommended_for: ["Enterprise portals", "High-volume applications", "Conservative industries"],
    layout_default: "single",
  },
  {
    id: "ats-classic",
    name: "ATS Classic Ivy",
    category: "ats",
    description: "Timeless academic and corporate structure inspired by Harvard and Wall Street recruitment.",
    ats_score: 99,
    is_ats_guaranteed: true,
    preview_tag: "Ivy League Standard",
    recommended_for: ["Consulting", "Finance", "Law", "Corporate"],
    layout_default: "single",
  },
  {
    id: "ats-onepage",
    name: "ATS One-Page Compact",
    category: "ats",
    description: "High-density single page layout engineered to fit maximum achievements into a single sheet.",
    ats_score: 97,
    is_ats_guaranteed: true,
    preview_tag: "High Density",
    recommended_for: ["Fast-scanning recruiters", "Engineering", "Operations"],
    layout_default: "compact",
  },
  {
    id: "modern-blue",
    name: "Modern Professional Blue",
    category: "modern",
    description: "Polished tech-executive aesthetic with deep sapphire accents and crisp typography hierarchy.",
    ats_score: 96,
    is_ats_guaranteed: true,
    preview_tag: "Recruiter Favorite",
    recommended_for: ["Tech", "Product Management", "Mid-to-Senior Roles"],
    layout_default: "single",
  },
  {
    id: "modern-split",
    name: "Modern Two-Column Split",
    category: "modern",
    description: "Sleek sidebar partitioning skills, education, and credentials from core career trajectory.",
    ats_score: 88,
    is_ats_guaranteed: false,
    preview_tag: "Visual Balance",
    recommended_for: ["Direct recruiter emails", "Executive introductions", "Networking"],
    layout_default: "two-column",
  },
  {
    id: "swe-tech",
    name: "Software Engineer Pro",
    category: "tech",
    description: "Structured for code repos, technical stacks, architecture impact, and latency metrics.",
    ats_score: 98,
    is_ats_guaranteed: true,
    preview_tag: "FAANG Tested",
    recommended_for: ["Software Engineers", "Systems Architects", "Backend Engineers"],
    layout_default: "single",
  },
  {
    id: "fullstack-dev",
    name: "Full-Stack Developer Split",
    category: "tech",
    description: "Two-column design balancing frontend frameworks and backend infrastructure.",
    ats_score: 89,
    is_ats_guaranteed: false,
    preview_tag: "Developer Highlight",
    recommended_for: ["Full Stack Devs", "Web Engineers", "Startup Engineers"],
    layout_default: "two-column",
  },
  {
    id: "ai-ml",
    name: "AI & ML Engineer Specialist",
    category: "data_ai",
    description: "Highlights PyTorch, LLMs, fine-tuning, embeddings, and research achievements.",
    ats_score: 92,
    is_ats_guaranteed: false,
    preview_tag: "GenAI & LLMs",
    recommended_for: ["AI Engineers", "ML Scientists", "Deep Learning Specialists"],
    layout_default: "two-column",
  },
  {
    id: "data-scientist",
    name: "Data Scientist Analytics",
    category: "data_ai",
    description: "Emphasizes statistics, SQL, data modeling, predictive modeling, and business ROI.",
    ats_score: 94,
    is_ats_guaranteed: true,
    preview_tag: "Data & Metrics",
    recommended_for: ["Data Scientists", "BI Analysts", "Quantitative Analysts"],
    layout_default: "two-column",
  },
  {
    id: "fresher-classic",
    name: "Campus Fresher Classic",
    category: "student_fresher",
    description: "Centers academic credentials, degrees, hackathons, and foundational coursework.",
    ats_score: 97,
    is_ats_guaranteed: true,
    preview_tag: "Entry-Level Friendly",
    recommended_for: ["Recent Grads", "Entry Level", "Junior Roles"],
    layout_default: "single",
  },
  {
    id: "btech-placement",
    name: "BTech Placement Standard",
    category: "student_fresher",
    description: "Engineered specifically for Indian campus drives (IIT, NIT, Tier-1/2 college placements).",
    ats_score: 99,
    is_ats_guaranteed: true,
    preview_tag: "Campus Placement",
    recommended_for: ["BTech Graduates", "Campus Drives", "TCS/Infosys/Wipro/Product Drives"],
    layout_default: "compact",
  },
  {
    id: "executive-classic",
    name: "Executive Leadership Classic",
    category: "executive",
    description: "Sophisticated serif typography and P&L impact formatting for VP & C-Suite candidates.",
    ats_score: 95,
    is_ats_guaranteed: true,
    preview_tag: "C-Suite & VP",
    recommended_for: ["Directors", "VPs", "Department Heads", "Executives"],
    layout_default: "single",
  },
  {
    id: "creative-modern",
    name: "Creative Modern Impact",
    category: "creative",
    description: "Vibrant header banner with high-contrast palette for agencies, design, and startups.",
    ats_score: 82,
    is_ats_guaranteed: false,
    preview_tag: "Portfolio Aesthetic",
    recommended_for: ["Product Designers", "Creative Leads", "Growth Marketers"],
    layout_default: "two-column",
  },
  {
    id: "visual-timeline",
    name: "Visual Career Timeline",
    category: "modern",
    description: "Chronological milestone timeline connecting progression points and key achievements.",
    ats_score: 85,
    is_ats_guaranteed: false,
    preview_tag: "Milestone Flow",
    recommended_for: ["Storytelling", "Portfolio Reviews", "Senior Consultancies"],
    layout_default: "timeline",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Designs" },
  { id: "ats", label: "ATS-Friendly (100%)" },
  { id: "modern", label: "Modern Professional" },
  { id: "tech", label: "Tech & Software" },
  { id: "data_ai", label: "Data & AI" },
  { id: "student_fresher", label: "Student & Fresher" },
  { id: "executive", label: "Executive & Leadership" },
  { id: "creative", label: "Creative & Startup" },
];

const COLOR_PALETTES = [
  { name: "Sapphire Blue", hex: "#2563eb" },
  { name: "Deep Navy", hex: "#1e3a8a" },
  { name: "Executive Slate", hex: "#0f172a" },
  { name: "Emerald Forest", hex: "#047857" },
  { name: "Royal Indigo", hex: "#4f46e5" },
  { name: "Ruby Crimson", hex: "#be123c" },
  { name: "Ocean Teal", hex: "#0e7490" },
  { name: "Monochrome Black", hex: "#111827" },
];

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Merriweather",
  "Georgia",
];

export default function TemplatesPage() {
  const { resume, setTemplate, customization, setCustomization } = useResumeStore();
  const [templates, setTemplates] = useState<TemplateMetadata[]>(FALLBACK_TEMPLATES);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(resume.template_id || "ats-minimal");

  // AI Recommendation Modal State
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<string>(resume.target_role || "Senior Full Stack Engineer");
  const [experienceLevel, setExperienceLevel] = useState<string>("experienced");
  const [industry, setIndustry] = useState<string>("Technology");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [aiRecommendation, setAiRecommendation] = useState<TemplateRecommendationResponse | null>(null);

  // 5-Versions Generator Modal State
  const [show5VersionsModal, setShow5VersionsModal] = useState<boolean>(false);
  const [isGenerating5, setIsGenerating5] = useState<boolean>(false);
  const [generatedVersions, setGeneratedVersions] = useState<Create5VersionsResponse | null>(null);
  const [copiedUrlIndex, setCopiedUrlIndex] = useState<number | null>(null);

  // Customization drawer tab state
  const [activeStudioTab, setActiveStudioTab] = useState<"catalog" | "customize">("catalog");
  const [mobileTab, setMobileTab] = useState<"catalog" | "preview">("catalog");

  // Fetch templates from API on mount
  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await templateApi.listTemplates();
        if (data && data.length > 0) {
          setTemplates(data);
        }
      } catch (err) {
        console.warn("Using local fallback template list", err);
      }
    }
    loadTemplates();
  }, []);

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = activeCategory === "all" || tpl.category === activeCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.recommended_for.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setTemplate(templateId);
  };

  // Run AI Recommendation
  const handleRunAiRecommendation = async () => {
    setIsAiLoading(true);
    try {
      const response = await templateApi.recommendTemplates({
        target_role: targetRole,
        experience_level: experienceLevel,
        industry: industry,
        job_description: jobDescription,
        resume_data: resume,
      });
      setAiRecommendation(response);
    } catch (err) {
      console.error("AI Recommendation failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run Create 5 Versions
  const handleGenerate5Versions = async () => {
    setIsGenerating5(true);
    try {
      const response = await templateApi.create5Versions({
        resume_id: resume.id,
        resume_data: resume,
        target_role: resume.target_role,
        job_description: jobDescription || undefined,
      });
      setGeneratedVersions(response);
    } catch (err) {
      console.error("5-versions generator failed:", err);
    } finally {
      setIsGenerating5(false);
    }
  };

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlIndex(index);
    setTimeout(() => setCopiedUrlIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner & Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Palette className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Multi-Template Resume Studio
              </h1>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Switch your verified candidate profile seamlessly across 24+ professional designs across 7 industry categories without rewriting or losing data.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAiModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-sm hover:from-purple-700 hover:to-indigo-700 transition"
            >
              <Sparkles className="h-4 w-4" />
              ✨ AI Recommend Design
            </button>
            <button
              onClick={() => setShow5VersionsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm shadow-sm hover:bg-blue-700 transition"
            >
              <Zap className="h-4 w-4" />
              ⚡ Create 5 Versions
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Body: Split View */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1">
        {/* Mobile View Toggle: Catalog vs Canvas */}
        <div className="lg:hidden flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 border border-slate-200 dark:border-slate-700">
          <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-1 shadow-xs border border-slate-200 dark:border-slate-700 w-full">
            <button
              onClick={() => setMobileTab("catalog")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mobileTab === "catalog"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              🎨 24+ Templates ({templates.length})
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mobileTab === "preview"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              👁️ Live Canvas Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Gallery & Customization (7 cols) */}
          <div className={`${mobileTab === "catalog" ? "block" : "hidden lg:block"} lg:col-span-7 space-y-5`}>
            {/* View Switcher Tabs: Catalog vs Fine-Tune Design */}
            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStudioTab("catalog")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    activeStudioTab === "catalog"
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  Template Catalog ({templates.length})
                </button>
                <button
                  onClick={() => setActiveStudioTab("customize")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    activeStudioTab === "customize"
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Sliders className="h-4 w-4" />
                  Design Studio & Styling
                </button>
              </div>

              {/* Active Selection Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 pr-2">
                <span>Active:</span>
                <span className="font-semibold text-slate-800">
                  {templates.find((t) => t.id === selectedTemplateId)?.name || selectedTemplateId}
                </span>
              </div>
            </div>

            {/* TAB 1: TEMPLATE CATALOG */}
            {activeStudioTab === "catalog" && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search templates by role, category or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                        activeCategory === cat.id
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Template Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((tpl) => {
                    const isSelected = selectedTemplateId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 bg-white relative flex flex-col justify-between ${
                          isSelected
                            ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div>
                          {/* Card Header & Badges */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {tpl.preview_tag}
                              </span>
                              <h3 className="font-bold text-slate-900 text-base mt-1.5">{tpl.name}</h3>
                            </div>
                            <div className="text-right shrink-0">
                              {tpl.is_ats_guaranteed ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                  <CheckCircle className="h-3 w-3" /> {tpl.ats_score}% ATS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                                  <AlertTriangle className="h-3 w-3" /> {tpl.ats_score}% Visual
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {tpl.description}
                          </p>

                          {/* Recommended For Chips */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {tpl.recommended_for.map((rec, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                              >
                                {rec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[11px] text-slate-500 font-mono">
                            Layout: {tpl.layout_default}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTemplate(tpl.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {isSelected ? "Active Design ✓" : "Apply Design"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: DESIGN STUDIO & STYLING CONTROLS */}
            {activeStudioTab === "customize" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-blue-600" /> Custom Design Engine
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Fine-tune typography, accent palettes, layout structures, and density. Content never resets.
                  </p>
                </div>

                {/* 1. Typography */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Type className="h-3.5 w-3.5 text-slate-500" /> Font Family
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font}
                        onClick={() => setCustomization({ font_family: font })}
                        className={`p-2.5 rounded-lg border text-left text-xs transition ${
                          customization.font_family === font
                            ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold">{font}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Sample ABC</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Color Themes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-slate-500" /> Primary Accent Palette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COLOR_PALETTES.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setCustomization({ color_theme: color.hex })}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition ${
                          customization.color_theme === color.hex
                            ? "border-blue-600 bg-blue-50/40 font-semibold"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className="h-4 w-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="truncate text-slate-800">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Layout Format */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layout className="h-3.5 w-3.5 text-slate-500" /> Structure & Layout Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {[
                      { id: "single", label: "Single-Column (ATS)", desc: "100% ATS Verified" },
                      { id: "two-column", label: "Two-Column Split", desc: "Sidebar for Skills" },
                      { id: "compact", label: "Compact 1-Page", desc: "High Information Density" },
                      { id: "timeline", label: "Visual Timeline", desc: "Milestone Storytelling" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() =>
                          setCustomization({
                            layout_format: mode.id as "single" | "two-column" | "compact" | "timeline",
                          })
                        }
                        className={`p-3 rounded-lg border text-left transition ${
                          customization.layout_format === mode.id
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{mode.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Header Style & Photo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                      Header Presentation
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "left", label: "Left Aligned" },
                        { id: "center", label: "Centered" },
                        { id: "banner", label: "Top Banner" },
                      ].map((h) => (
                        <button
                          key={h.id}
                          onClick={() =>
                            setCustomization({
                              header_style: h.id as "left" | "center" | "banner",
                            })
                          }
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                            customization.header_style === h.id
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                      Profile Photo
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCustomization({ show_photo: false })}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                          !customization.show_photo
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Hide (ATS Recommended)
                      </button>
                      <button
                        onClick={() => setCustomization({ show_photo: true })}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                          customization.show_photo
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Show Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Density & Spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Font Size</label>
                    <select
                      value={customization.font_size}
                      onChange={(e) =>
                        setCustomization({ font_size: e.target.value as "sm" | "md" | "lg" })
                      }
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="sm">Small (9.5pt Compact)</option>
                      <option value="md">Medium (10.5pt Standard)</option>
                      <option value="lg">Large (11.5pt Relaxed)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Section Spacing</label>
                    <select
                      value={customization.section_spacing}
                      onChange={(e) =>
                        setCustomization({
                          section_spacing: e.target.value as "compact" | "normal" | "relaxed",
                        })
                      }
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="compact">Tight (1-Page Density)</option>
                      <option value="normal">Normal</option>
                      <option value="relaxed">Spacious</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Page Margins</label>
                    <select
                      value={customization.page_margin}
                      onChange={(e) =>
                        setCustomization({
                          page_margin: e.target.value as "narrow" | "normal" | "wide",
                        })
                      }
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="narrow">Narrow (0.5 inch)</option>
                      <option value="normal">Normal (0.75 inch)</option>
                      <option value="wide">Wide (1.0 inch)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Real-Time Live Preview (5 cols) */}
          <div className={`${mobileTab === "preview" ? "block" : "hidden lg:block"} lg:col-span-5 sticky top-20 space-y-4`}>
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Real-time Canvas
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Previewing: {templates.find((t) => t.id === selectedTemplateId)?.name || selectedTemplateId}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href="/builder/new"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    Edit Content <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Resume Component */}
              <div className="h-[680px] rounded-lg overflow-hidden border border-slate-200">
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: AI RECOMMEND DESIGN MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  <Sparkles className="h-3.5 w-3.5" /> Smart Design Matcher
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  AI Design & Layout Recommendation
                </h2>
                <p className="text-xs text-slate-600">
                  AI analyzes your career level, industry conventions, and target job requirements to select the highest-converting templates.
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="student">Student / Campus Placement</option>
                    <option value="fresher">Fresher (0-1 yrs)</option>
                    <option value="experienced">Experienced Professional (2-8 yrs)</option>
                    <option value="executive">Director / VP / Executive (8+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Job Description (Optional - for high-precision keyword layout tuning)
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste snippet of the target job description or requirements..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleRunAiRecommendation}
                disabled={isAiLoading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing Career Profile & Requirements...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Analyze & Recommend Top 3 Designs
                  </>
                )}
              </button>
            </div>

            {/* AI Recommendation Results */}
            {aiRecommendation && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 text-xs text-purple-900 leading-relaxed">
                  <span className="font-bold block mb-1">💡 Strategic Design Rationale:</span>
                  {aiRecommendation.advice_summary}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recommended Design Options:
                  </h4>
                  {aiRecommendation.recommended_templates.map((rec, index) => (
                    <div
                      key={rec.template_id}
                      className="border border-slate-200 rounded-xl p-3.5 hover:border-purple-300 transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{rec.template_name}</span>
                          {rec.is_primary_recommendation && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              #1 Best Fit
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-purple-700">
                            {rec.match_score}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{rec.rationale}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rec.key_advantages.map((adv, i) => (
                            <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                              ✓ {adv}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectTemplate(rec.template_id);
                          setShowAiModal(false);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs whitespace-nowrap shrink-0 shadow-xs"
                      >
                        Apply This Design
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE 5 VERSIONS MODAL */}
      {show5VersionsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  <Zap className="h-3.5 w-3.5" /> High-Velocity Job Search
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  1-Click Multi-Version Resume Generator
                </h2>
                <p className="text-xs text-slate-600">
                  Instantly spawn 5 distinct variations of your verified profile tailored for ATS portals, recruiter cold outreach, compact screening, and public web sharing.
                </p>
              </div>
              <button
                onClick={() => setShow5VersionsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Action Trigger Button */}
            {!generatedVersions && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">1. ATS Minimalist</span>
                    <span className="text-slate-600">Workday & Taleo portals. 100% text parsing guarantee.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">2. Modern Professional</span>
                    <span className="text-slate-600">Direct recruiter email & LinkedIn InMail attachments.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">3. Role-Tailored Technical</span>
                    <span className="text-slate-600">Reorders and elevates primary tech stack keywords.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">4. Compact One-Page</span>
                    <span className="text-slate-600">Dense layout for 6-second recruiter scans.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 sm:col-span-2">
                    <span className="font-bold text-slate-900 block mb-1">5. Vanity Public Web Link</span>
                    <span className="text-slate-600">Live shareable link for LinkedIn bio and portfolio with view metrics.</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerate5Versions}
                  disabled={isGenerating5}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition"
                >
                  {isGenerating5 ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Generating 5 Targeted Variations...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" /> Spawn 5 Targeted Resumes Now
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Generated Versions Display */}
            {generatedVersions && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Successfully spawned {generatedVersions.total_versions} targeted resume records in your dashboard!
                  </span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {generatedVersions.versions.map((v, idx) => (
                    <div
                      key={v.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-blue-300 transition space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{v.version_name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              {v.ats_score}% ATS
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{v.purpose}</p>
                        </div>
                      </div>

                      {/* Download and Share CTAs */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
                        {v.download_urls.docx && (
                          <a
                            href={v.download_urls.docx}
                            download
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
                          >
                            <Download className="h-3 w-3" /> Word (.docx)
                          </a>
                        )}
                        {v.download_urls.txt && (
                          <a
                            href={v.download_urls.txt}
                            download
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
                          >
                            <Download className="h-3 w-3" /> Plain Text (.txt)
                          </a>
                        )}
                        {v.download_urls.html && (
                          <a
                            href={v.download_urls.html}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium"
                          >
                            <ExternalLink className="h-3 w-3" /> HTML View
                          </a>
                        )}
                        {v.download_urls.web && (
                          <button
                            onClick={() => handleCopyLink(v.download_urls.web!, idx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium"
                          >
                            {copiedUrlIndex === idx ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" /> Copied Link!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy Vanity Link
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <a
                    href="/dashboard"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    View All in Dashboard →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
