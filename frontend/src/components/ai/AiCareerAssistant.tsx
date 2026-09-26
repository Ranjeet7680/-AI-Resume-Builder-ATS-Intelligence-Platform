"use client";

import { useState } from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import { MessageSquare, Send, Sparkles, X, Mic, MicOff, Volume2, VolumeX, ExternalLink, Globe } from "lucide-react";
import { chatApi } from "@/lib/api";
import { speechRecognizer, textToSpeech } from "@/lib/speech";
import { useResumeStore } from "@/store/useResumeStore";

export default function AiCareerAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { resume } = useResumeStore();
  const [messages, setMessages] = useState<Array<{ role: string; content: string; actions?: string[]; language?: string }>>([
    {
      role: "assistant",
      content: `Namaste ${resume.personal_info.fullName || "there"}! I'm your AI Career Coach. You can ask me in English, Hindi (हिन्दी), Hinglish, or other Indian languages.`,
      actions: [
        "Improve my summary",
        "Mera resume check karo",
        "What skills am I missing?",
        "Start mock interview",
      ],
      language: "en",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    const newMsgs = [...messages, { role: "user", content: userText }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    try {
      const res = await chatApi.sendMessage({
        messages: newMsgs.map((m, idx) => ({
          id: `m-${idx}`,
          role: m.role,
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
        resume_context: resume,
        target_role: resume.target_role,
        language: "auto",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          actions: res.suggested_actions?.slice(0, 3),
          language: res.detected_language,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `To optimize your candidacy for ${resume.target_role}: 1) Quantify your achievements using the XYZ formula, 2) Highlight key tech stacks, and 3) Practice with our AI Voice Mock Interview.`,
          actions: ["Improve summary", "Open Career Coach"],
          language: "en",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleRecording = () => {
    if (!speechRecognizer.isSupported()) {
      alert("Microphone recognition not supported in this browser.");
      return;
    }

    if (isRecording) {
      speechRecognizer.stop();
      setIsRecording(false);
    } else {
      textToSpeech.stop();
      setSpeakingIndex(null);
      speechRecognizer.start({
        language: "en-IN",
        continuous: false,
        interimResults: false,
        onStart: () => setIsRecording(true),
        onResult: (text, isFinal) => {
          if (isFinal && text) {
            setIsRecording(false);
            sendMessage(text);
          }
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false),
      });
    }
  };

  const toggleSpeak = (idx: number, text: string) => {
    if (speakingIndex === idx) {
      textToSpeech.stop();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(idx);
      textToSpeech.speak(text, {
        language: "en-IN",
        onEnd: () => setSpeakingIndex(null),
        onError: () => setSpeakingIndex(null),
      });
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold shadow-xl shadow-blue-500/30 hover:shadow-glow hover:scale-105 active:scale-95 transition-all transform animate-float"
          aria-label="Open AI Career Coach"
        >
          <div className="relative">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs tracking-tight">AI Coach 🎙️</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[410px] h-[520px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">AI Career Coach (Voice & Multilingual)</h4>
                <p className="text-[10px] text-blue-100">12 Indian Languages & Hinglish</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/career-coach");
                }}
                title="Open Full Screen Studio"
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  textToSpeech.stop();
                  setIsOpen(false);
                }}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none space-y-1.5"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        onClick={() => toggleSpeak(i, msg.content)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                      >
                        {speakingIndex === i ? (
                          <>
                            <VolumeX className="h-3 w-3 text-rose-600 animate-pulse" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" />
                            Listen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 max-w-[88%]">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act === "Open Career Coach" || act === "Start mock interview") {
                            setIsOpen(false);
                            router.push("/career-coach");
                          } else {
                            sendMessage(act);
                          }
                        }}
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

          {/* Input Bar with Mic */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl border transition ${
                isRecording
                  ? "bg-rose-600 border-rose-600 text-white animate-pulse"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              title="Voice Input (Hindi/English/Indian Languages)"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Type in English, Hindi, or Hinglish..."
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
