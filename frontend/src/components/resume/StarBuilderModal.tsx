"use client";

import { useState } from "react";
import { Sparkles, Wand2, Check, X, Compass } from "lucide-react";
import { aiApi } from "@/lib/api";

interface StarBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (bullet: string) => void;
  defaultRole?: string;
}

export default function StarBuilderModal({
  isOpen,
  onClose,
  onApply,
  defaultRole = "Software Engineer",
}: StarBuilderModalProps) {
  const [role, setRole] = useState(defaultRole);
  const [challenge, setChallenge] = useState("Slow API response times causing client checkout timeouts");
  const [technology, setTechnology] = useState("FastAPI, Redis, and PostgreSQL connection pooling");
  const [action, setAction] = useState("Implemented asynchronous query caching and indexed high-frequency foreign keys");
  const [result, setResult] = useState("Reduced p99 latency by 55% across 2M daily requests");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedBullet, setGeneratedBullet] = useState<{
    bullet_point: string;
    action_verb: string;
    alternative: string;
    rationale: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await aiApi.starBuilder({
        role,
        task_challenge: challenge,
        technology,
        action_taken: action,
        result_metric: result,
      });
      setGeneratedBullet(res);
    } catch {
      // Deterministic fallback
      setGeneratedBullet({
        bullet_point: `Architected and deployed ${technology} to resolve ${challenge.toLowerCase()}, executing ${action.toLowerCase()}, resulting in ${result}.`,
        action_verb: "Architected",
        alternative: `Spearheaded optimization of ${technology} addressing ${challenge.toLowerCase()}, leading implementation of ${action.toLowerCase()} to deliver ${result}.`,
        rationale: "Synthesized via STAR framework: Action verb + Technology + Problem context + Measurable metric."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Guided STAR Experience Builder</h3>
              <p className="text-xs text-slate-500">
                Structure: Situation/Task ➔ Action ➔ Result (XYZ Formula)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Job Role / Project</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Technologies Used</label>
              <input
                type="text"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                placeholder="e.g. React, Next.js, Redis, Docker"
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              1. Situation & Challenge (What problem were you solving?)
            </label>
            <input
              type="text"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="e.g. Website had 4s load times and poor mobile responsiveness"
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              2. Action (What specific engineering steps did you take?)
            </label>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              rows={2}
              placeholder="e.g. Modularized components, added lazy-loading, and implemented server-side rendering"
              className="w-full mt-1 p-3 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              3. Measurable Result / Outcome (Numbers, % improved, time saved)
            </label>
            <input
              type="text"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="e.g. Decreased load latency by 45% and grew conversion by 18%"
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !action.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow transition"
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "Synthesizing STAR..." : "Synthesize Executive Bullet"}
            </button>
          </div>

          {/* Generated Result */}
          {generatedBullet && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  <Check className="h-4 w-4" /> Synthesized XYZ Achievement
                </span>
                <span className="text-xs text-slate-500">
                  Verb: <strong className="text-slate-800">{generatedBullet.action_verb}</strong>
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-indigo-200/70 text-xs font-semibold text-slate-900 leading-relaxed shadow-sm">
                {generatedBullet.bullet_point}
              </div>

              {generatedBullet.alternative && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Alternative Phrasing:</span>
                  <div className="p-2.5 bg-white/70 rounded-lg mt-1 text-[11px] text-slate-700">
                    {generatedBullet.alternative}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onApply(generatedBullet.bullet_point)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition"
                >
                  <Check className="h-4 w-4" /> Insert into Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
