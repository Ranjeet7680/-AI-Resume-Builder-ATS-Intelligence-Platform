"use client";

import { useState } from "react";
import { Sparkles, Wand2, Check, Copy, ArrowRight, X } from "lucide-react";
import { aiApi } from "@/lib/api";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (improvedText: string) => void;
  defaultText?: string;
  targetRole?: string;
}

export default function AiAssistantModal({
  isOpen,
  onClose,
  onApply,
  defaultText = "",
  targetRole = "Software Engineer",
}: AiAssistantModalProps) {
  const [text, setText] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    improved_text: string;
    alternatives: string[];
    action_verb_used: string;
    rationale: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleImprove = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await aiApi.improveBullet(text, targetRole);
      setResult(res);
    } catch {
      // Offline fallback
      setResult({
        improved_text: `Architected and deployed ${text.trim().replace(/^i /i, "")}, optimizing operational performance and code maintainability.`,
        alternatives: [
          `Spearheaded development of ${text.trim()}, ensuring modular software architecture and rigorous test coverage.`,
        ],
        action_verb_used: "Architected",
        rationale: "Transformed passive formulation into an active, XYZ achievement without hallucinating unsupported metrics."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI Bullet Enhancer (XYZ Formula)</h3>
              <p className="text-xs text-slate-500">Transform raw drafts into executive recruiter-ready achievements</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Raw Draft / Experience Bullet
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., I made a website using React"
              rows={3}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Target Role: <strong className="text-slate-700">{targetRole}</strong></span>
            <button
              onClick={handleImprove}
              disabled={isLoading || !text.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Enhance with AI
                </>
              )}
            </button>
          </div>

          {/* AI Result Card */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  <Check className="h-3.5 w-3.5" /> High-Impact Polish
                </span>
                <span className="text-xs text-slate-500">Verb: <strong>{result.action_verb_used}</strong></span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-blue-200/60 text-sm font-medium text-slate-900 leading-relaxed">
                {result.improved_text}
              </div>

              {result.alternatives && result.alternatives.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Alternative Variation:</span>
                  <div className="p-2.5 bg-white/70 rounded-lg text-xs text-slate-700">
                    {result.alternatives[0]}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => onApply(result.improved_text)}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                >
                  <Check className="h-3.5 w-3.5" /> Apply to Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
