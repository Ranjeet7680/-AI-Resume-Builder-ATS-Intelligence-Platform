"use client";

import { useState } from "react";
import { MessageSquare, Send, Sparkles, X, ChevronDown, CheckCircle2 } from "lucide-react";
import { aiApi } from "@/lib/api";
import { useResumeStore } from "@/store/useResumeStore";

export default function AiCareerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { resume } = useResumeStore();
  const [messages, setMessages] = useState<Array<{ role: string; content: string; actions?: string[] }>>([
    {
      role: "assistant",
      content: `Hello ${resume.personal_info.fullName || "there"}! I'm your AI Career Strategist. Ask me how to tailor your resume for ${resume.target_role || "your target role"}, identify missing keywords, or optimize for recruiters.`,
      actions: [
        "What skills am I missing for this role?",
        "How can I improve my project descriptions?",
        "How do I boost my ATS score?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs = [...messages, { role: "user", content: userText }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    try {
      const res = await aiApi.careerChat({
        messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
        target_role: resume.target_role,
        resume_context: `Title: ${resume.title}, Target: ${resume.target_role}, Skills: ${resume.skills.map((s) => s.items.join(", ")).join("; ")}`,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          actions: res.suggested_actions,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `To optimize your candidacy for ${resume.target_role}: 1) Ensure you have quantifiable numbers (e.g. latency reduced by X% or user volume) on your experience bullets, 2) Highlight modern containerization and cloud tools like Docker and AWS, and 3) Keep the single-column ATS layout.`,
          actions: ["Scan ATS Keywords", "Generate Cover Letter"],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xl shadow-blue-500/30 hover:scale-105 transition transform"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs">AI Career Mentor</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <div>
                <h4 className="text-xs font-bold">AI Career & Resume Assistant</h4>
                <p className="text-[10px] text-blue-100">Live Context: {resume.target_role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 max-w-[88%]">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(act)}
                        className="text-[10px] font-medium bg-white hover:bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-200 transition"
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask for advice, bullet rewrites, or ATS tips..."
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
