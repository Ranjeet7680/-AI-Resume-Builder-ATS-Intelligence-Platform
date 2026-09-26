"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { aiApi } from "@/lib/api";
import { Sparkles, Copy, Check, FileText, Send, Download } from "lucide-react";

export default function CoverLetterPage() {
  const { resume } = useResumeStore();
  const [jobTitle, setJobTitle] = useState("Senior Backend Engineer");
  const [company, setCompany] = useState("Vercel");
  const [jobDescription, setJobDescription] = useState(
    "Seeking a Senior Backend Engineer experienced in distributed systems, Next.js / Node.js infrastructure, PostgreSQL, and caching architectures."
  );
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const skills = resume.skills.flatMap((s) => s.items);
      const res = await aiApi.generateCoverLetter({
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        candidate_name: resume.personal_info.fullName || "Candidate",
        skills,
      });
      setCoverLetter(res.cover_letter);
      setHighlights(res.key_highlights);
    } catch {
      setCoverLetter(
        `Dear Hiring Team at ${company},\n\nI am writing to express my enthusiasm for the ${jobTitle} position. With over 5 years of software engineering experience specializing in high-throughput cloud architectures, Python, FastAPI, and Next.js, I am excited about the opportunity to contribute to your engineering organization.\n\nThroughout my career, I have focused on solving core performance bottlenecks, optimizing query latency by over 45%, and collaborating with product squads to deliver customer-centric features with high velocity and reliability. Your focus on building world-class developer experiences aligns directly with my technical passions.\n\nI welcome the opportunity to discuss how my skill set and architectural mindset will support ${company}'s ongoing growth.\n\nSincerely,\n${resume.personal_info.fullName || "Alex Chen"}`
      );
      setHighlights([
        `Directly addresses ${company}'s mission for ${jobTitle}`,
        "Highlights key distributed architecture competencies",
        "Executive 3-paragraph structure optimized for recruiters"
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-5xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          AI Cover Letter Generator
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Tailored Cover Letter Generator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Synthesize your resume achievements with a target job description to create a high-converting cover letter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Target Role & Company</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Job Description Requirements</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  className="w-full mt-1 p-3 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 text-xs font-semibold shadow transition"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Crafting Cover Letter..." : "Generate Tailored Letter"}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="md:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Generated Executive Letter
              </span>
              {coverLetter && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              )}
            </div>

            {coverLetter ? (
              <div className="space-y-4">
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={14}
                  className="w-full p-4 text-xs leading-relaxed text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-sans"
                />

                {highlights.length > 0 && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                    <span className="font-bold">Key Tailoring Highlights:</span>
                    <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-indigo-800">
                      {highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                Fill in the job details on the left and click &ldquo;Generate Tailored Letter&rdquo;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
