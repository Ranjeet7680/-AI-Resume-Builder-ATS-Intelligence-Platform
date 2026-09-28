"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { chatApi } from "@/lib/api";
import { speechRecognizer, textToSpeech } from "@/lib/speech";
import { ChatMessage, ChatActionCard, InterviewAnswerResponse, InterviewStartResponse } from "@/types/chat";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Globe,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  FileText,
  Target,
  ArrowRight,
  Shield,
  Award,
  Layers,
  HelpCircle,
  ChevronRight,
  Radio,
  Sliders,
  Settings2,
} from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "auto", name: "Auto-Detect Language", native: "🌐 Auto", bcp47: "en-IN" },
  { code: "en", name: "English (India)", native: "English", bcp47: "en-IN" },
  { code: "hi", name: "Hindi", native: "हिन्दी", bcp47: "hi-IN" },
  { code: "hinglish", name: "Hinglish", native: "Hinglish (Hindi-English)", bcp47: "hi-IN" },
  { code: "bn", name: "Bengali", native: "বাংলা", bcp47: "bn-IN" },
  { code: "mr", name: "Marathi", native: "मराठी", bcp47: "mr-IN" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", bcp47: "gu-IN" },
  { code: "ta", name: "Tamil", native: "தமிழ்", bcp47: "ta-IN" },
  { code: "te", name: "Telugu", native: "తెలుగు", bcp47: "te-IN" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", bcp47: "kn-IN" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", bcp47: "ml-IN" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", bcp47: "pa-IN" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", bcp47: "or-IN" },
  { code: "as", name: "Assamese", native: "অসমীয়া", bcp47: "as-IN" },
];

const INTERVIEW_TRACKS = [
  { id: "technical", label: "Technical Deep-Dive", icon: "💻", desc: "Concurrency, APIs, databases & system internals" },
  { id: "behavioral", label: "HR & STAR Behavioral", icon: "🤝", desc: "Conflict resolution, leadership & SLA crisis management" },
  { id: "ai_ml", label: "AI / ML Engineering", icon: "🧠", desc: "Vector embeddings, LLM orchestration & model latency" },
  { id: "system_design", label: "System Design & Architecture", icon: "🏛️", desc: "Distributed scaling, caching & microservice fault tolerance" },
  { id: "project_based", label: "Resume Project Defense", icon: "📂", desc: "Targeted interrogation on your listed resume projects" },
];

export default function CareerCoachPage() {
  const router = useRouter();
  const { resume, updatePersonalInfo, addSkill } = useResumeStore();

  // Active Mode: 'chat' | 'voice' | 'interview'
  const [activeTab, setActiveTab] = useState<"chat" | "voice" | "interview">("chat");
  const [mobileView, setMobileView] = useState<"studio" | "settings">("studio");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Namaste! I am your **AI Career Copilot**. I have loaded your verified resume and target role. You can chat with me via text, speak naturally using voice in English, Hindi, Hinglish, Bengali, Tamil, Telugu, and other Indian languages, or practice an interactive mock interview.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      language: "en",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLangInfo, setDetectedLangInfo] = useState<string | null>(null);

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [hasMicConsent, setHasMicConsent] = useState(true);

  // Mock Interview State
  const [interviewTrack, setInterviewTrack] = useState("technical");
  const [interviewSession, setInterviewSession] = useState<InterviewStartResponse | null>(null);
  const [interviewAnswerText, setInterviewAnswerText] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewAnswerResponse | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);

  // Resume context drawer
  const [targetRole, setTargetRole] = useState(resume.target_role || "Senior Full-Stack Engineer");
  const [jobDescription, setJobDescription] = useState(
    "Looking for a Senior Software Engineer experienced in Python, FastAPI, distributed caching with Redis, and React."
  );
  const [appliedCardActionId, setAppliedCardActionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Stop TTS on unmount
  useEffect(() => {
    return () => {
      textToSpeech.stop();
      speechRecognizer.stop();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Speech-to-Text Handling
  // ---------------------------------------------------------------------------
  const getBcp47Code = () => {
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);
    return langObj && langObj.code !== "auto" ? langObj.bcp47 : "en-IN";
  };

  const toggleRecording = () => {
    if (!speechRecognizer.isSupported()) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isRecording) {
      speechRecognizer.stop();
      setIsRecording(false);
      if (interimTranscript.trim()) {
        handleSendMessage(interimTranscript.trim(), true);
        setInterimTranscript("");
      }
    } else {
      textToSpeech.stop();
      setSpeakingMessageId(null);
      setInterimTranscript("");

      const started = speechRecognizer.start({
        language: getBcp47Code(),
        continuous: false,
        interimResults: true,
        onStart: () => setIsRecording(true),
        onResult: (transcript, isFinal) => {
          setInterimTranscript(transcript);
          if (isFinal) {
            speechRecognizer.stop();
            setIsRecording(false);
            handleSendMessage(transcript, true);
            setInterimTranscript("");
          }
        },
        onError: (err) => {
          setIsRecording(false);
          console.warn("Speech recognition error:", err);
        },
        onEnd: () => setIsRecording(false),
      });

      if (!started) {
        setIsRecording(false);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Text-to-Speech Handling
  // ---------------------------------------------------------------------------
  const handleToggleSpeak = (msgId: string, text: string, langCode: string = "en") => {
    if (speakingMessageId === msgId) {
      textToSpeech.stop();
      setSpeakingMessageId(null);
      return;
    }

    const bcp47 = SUPPORTED_LANGUAGES.find((l) => l.code === langCode)?.bcp47 || "en-IN";
    setSpeakingMessageId(msgId);
    textToSpeech.speak(text, {
      language: bcp47,
      speed: speechSpeed,
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  // ---------------------------------------------------------------------------
  // Chat Dispatch
  // ---------------------------------------------------------------------------
  const handleSendMessage = async (textToSend?: string, isVoiceTurn: boolean = false) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsLoading(true);

    try {
      const res = await chatApi.sendMessage({
        messages: [...messages, userMsg],
        resume_context: resume,
        job_description: jobDescription,
        target_role: targetRole,
        language: selectedLanguage,
        voice_enabled: isVoiceTurn || activeTab === "voice",
      });

      setDetectedLangInfo(`${res.language_name} ${res.is_hinglish ? "(Hinglish)" : ""}`);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        language: res.detected_language,
        action_card: res.action_card,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If in Voice-to-Voice mode, automatically speak back the reply
      if (activeTab === "voice" || isVoiceTurn) {
        handleToggleSpeak(aiMsg.id, res.reply, res.detected_language);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I experienced a temporary communication hiccup. You can still use the quick action buttons below or retry your message.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action Card Handlers
  // ---------------------------------------------------------------------------
  const handleExecuteAction = (action: ChatActionCard, cardId: string) => {
    if (action.action_type === "improve_summary") {
      const newSummary = action.preview_data?.proposed_summary;
      if (newSummary) {
        updatePersonalInfo("summary", newSummary);
        setAppliedCardActionId(cardId);
      }
    } else if (action.action_type === "tailor_job") {
      router.push("/tailor");
    } else if (action.action_type === "analyze_ats") {
      router.push("/ats-analyzer");
    } else if (action.action_type === "cover_letter") {
      router.push("/cover-letter");
    } else if (action.action_type === "skill_gaps") {
      const skillsToAdd = action.preview_data?.recommended_skills || [];
      if (skillsToAdd.length > 0) {
        addSkill("Technical Competencies", skillsToAdd[0]);
        setAppliedCardActionId(cardId);
      }
    } else if (action.action_type === "start_interview") {
      setActiveTab("interview");
    } else if (action.action_type === "optimize_linkedin") {
      handleSendMessage("Suggest 3 recruiter-optimized LinkedIn headlines for my profile.");
    }
  };

  // ---------------------------------------------------------------------------
  // Mock Interview Dispatch
  // ---------------------------------------------------------------------------
  const handleStartInterview = async () => {
    setIsInterviewLoading(true);
    try {
      const res = await chatApi.startInterview({
        target_role: targetRole,
        interview_mode: interviewTrack,
        resume_data: resume,
        job_description: jobDescription,
        language: selectedLanguage === "auto" ? "en" : selectedLanguage,
      });
      setInterviewSession(res);
      setInterviewFeedback(null);
      setInterviewHistory([]);
      setInterviewAnswerText("");

      // Automatically speak the interview question
      textToSpeech.speak(res.first_question, {
        language: getBcp47Code(),
        speed: speechSpeed,
      });
    } catch {
      // Fallback
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handleSubmitInterviewAnswer = async () => {
    if (!interviewSession || !interviewAnswerText.trim() || isInterviewLoading) return;
    setIsInterviewLoading(true);

    try {
      const res: InterviewAnswerResponse = await chatApi.answerInterview({
        session_id: interviewSession.session_id,
        question: interviewFeedback?.next_question || interviewSession.first_question,
        answer_text: interviewAnswerText.trim(),
        interview_mode: interviewTrack,
        target_role: targetRole,
        question_index: interviewHistory.length + 1,
        total_questions: interviewSession.total_questions,
        language: selectedLanguage === "auto" ? "en" : selectedLanguage,
        resume_context: resume,
      });

      setInterviewFeedback(res);
      setInterviewHistory((prev) => [
        ...prev,
        {
          question: interviewFeedback?.next_question || interviewSession.first_question,
          answer: interviewAnswerText.trim(),
          score: res.score,
          breakdown: res.breakdown,
        },
      ]);
      setInterviewAnswerText("");

      // Read feedback & next question if available
      const verbalFeedback = res.next_question
        ? `${res.feedback}. Here is your next question: ${res.next_question}`
        : `${res.feedback}. That concludes your mock interview session!`;

      textToSpeech.speak(verbalFeedback, {
        language: getBcp47Code(),
        speed: speechSpeed,
      });
    } catch {
      // Keep state
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to permanently wipe conversational and voice transcription history?")) {
      try {
        await chatApi.deleteChatHistory("default");
        setMessages([
          {
            id: `sys-${Date.now()}`,
            role: "assistant",
            content: "Conversation history and voice buffers permanently cleared. Ready for your next query.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            language: "en",
          },
        ]);
        textToSpeech.stop();
        setSpeakingMessageId(null);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
      {/* Privacy Notice Banner */}
      {hasMicConsent && (
        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200/80 px-4 py-2.5 flex items-center justify-between text-xs text-blue-900 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              <strong>Private & Secure Voice:</strong> Microphone audio is processed in real time and is never retained or sold. You can wipe your conversational history anytime.
            </span>
          </div>
          <button
            onClick={() => setHasMicConsent(false)}
            className="text-blue-700 hover:text-blue-950 font-semibold underline shrink-0 ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mobile-Only Segmented View Switcher */}
      <div className="flex lg:hidden rounded-2xl bg-slate-100 p-1 mb-4 text-xs font-bold shadow-xs">
        <button
          onClick={() => setMobileView("studio")}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileView === "studio"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Interactive Studio ({activeTab === "chat" ? "💬 Chat" : activeTab === "voice" ? "🎙️ Voice" : "🏆 Mock"})
        </button>
        <button
          onClick={() => setMobileView("settings")}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileView === "settings"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Settings2 className="h-3.5 w-3.5" />
          Role &amp; Languages
        </button>
      </div>

      {/* Main Grid: Left Control/Context Drawer & Right Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ------------------------------------------------------------------- */}
        {/* LEFT COLUMN: Controls, Indian Languages & Resume Context (4 cols)   */}
        {/* ------------------------------------------------------------------- */}
        <div className={`lg:col-span-4 space-y-5 ${mobileView === "settings" ? "block" : "hidden lg:block"}`}>
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">AI Career Coach</h1>
                  <p className="text-xs text-slate-500">Voice-to-Voice & Indian Languages</p>
                </div>
              </div>
              <button
                onClick={handleClearHistory}
                title="Wipe Session & History"
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => {
                  textToSpeech.stop();
                  setActiveTab("chat");
                }}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "chat" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
                }`}
              >
                💬 Text Chat
              </button>
              <button
                onClick={() => {
                  textToSpeech.stop();
                  setActiveTab("voice");
                }}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "voice" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
                }`}
              >
                🎙️ Live Voice
              </button>
              <button
                onClick={() => {
                  textToSpeech.stop();
                  setActiveTab("interview");
                }}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "interview" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
                }`}
              >
                🧑‍💼 Mock Interview
              </button>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  Language & Script
                </span>
                {detectedLangInfo && (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Detected: {detectedLangInfo}
                  </span>
                )}
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} — {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Speech Playback Speed Selector */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-1">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-blue-600" />
                TTS Speed
              </span>
              <div className="flex items-center gap-1">
                {[0.85, 1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeechSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      speechSpeed === spd
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Grounding Context Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Active Resume Anchor
              </h2>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                ATS: {resume.ats_score || 85}/100
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Job Description / Role Requirements
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job requirements to tailor advice..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-700">Verified Resume Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {resume.skills.flatMap((s) => s.items).slice(0, 8).map((skill, i) => (
                    <span
                      key={i}
                      className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200 shadow-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Interactive Workspace (Chat / Voice / Interview) (8c) */}
        {/* ------------------------------------------------------------------- */}
        <div className={`lg:col-span-8 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[calc(100vh-14rem)] min-h-[560px] max-h-[820px] ${mobileView === "studio" ? "flex" : "hidden lg:flex"}`}>
          {/* TAB 1: TEXT CHAT & CONVERSATION STUDIO */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col h-full">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border border-slate-200 text-slate-900 rounded-bl-none space-y-3"
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>

                      {/* Action Card if triggered */}
                      {msg.action_card && (
                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-slate-900 space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            {msg.action_card.title}
                          </div>
                          <p className="text-xs text-slate-600">{msg.action_card.description}</p>

                          {msg.action_card.preview_data?.proposed_summary && (
                            <div className="rounded-lg bg-white p-2.5 text-xs text-slate-800 border border-blue-100 italic">
                              "{msg.action_card.preview_data.proposed_summary}"
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleExecuteAction(msg.action_card!, msg.id)}
                              disabled={appliedCardActionId === msg.id}
                              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs flex items-center gap-1 disabled:opacity-60 transition-colors"
                            >
                              {appliedCardActionId === msg.id ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                  Applied to Resume
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                  {msg.action_card.primary_cta}
                                </>
                              )}
                            </button>
                            {msg.action_card.secondary_cta && (
                              <button
                                onClick={() => handleExecuteAction(msg.action_card!, msg.id)}
                                className="rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold"
                              >
                                {msg.action_card.secondary_cta}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Message Footer: Listen Button & Timestamp */}
                      <div className="flex items-center justify-between gap-4 pt-1 text-[11px] opacity-80 border-t border-slate-100/60">
                        <span>{msg.timestamp}</span>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.content, msg.language)}
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {speakingMessageId === msg.id ? (
                              <>
                                <VolumeX className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3.5 w-3.5" />
                                Listen
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 animate-pulse">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span>AI Career Coach is analyzing your resume and generating response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
                      isRecording
                        ? "bg-rose-600 border-rose-600 text-white animate-pulse shadow-md"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                    title={isRecording ? "Stop recording" : "Voice input"}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask resume advice, paste job requirements, or try 'Mera summary improve karo'..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE VOICE-TO-VOICE STUDIO */}
          {activeTab === "voice" && (
            <div className="flex-1 flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-slate-50 to-white">
              {/* Studio Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  <Radio className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                  Live Conversational Voice Mode
                </div>
                <h2 className="text-xl font-bold text-slate-900">Speak Naturally in English or Indian Languages</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  The AI listens to your voice, detects your language automatically, formulates career recommendations, and speaks back immediately.
                </p>
              </div>

              {/* Big Voice Microphone Button & Pulse Wave */}
              <div className="my-auto flex flex-col items-center justify-center space-y-6">
                <div className="relative flex items-center justify-center">
                  {isRecording && (
                    <div className="absolute h-40 w-40 rounded-full bg-rose-500/20 animate-ping" />
                  )}
                  <button
                    onClick={toggleRecording}
                    className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-full text-white shadow-xl transition-all transform active:scale-95 ${
                      isRecording
                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 scale-105"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                    }`}
                  >
                    {isRecording ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
                  </button>
                </div>

                {/* Status Indicator & Voice Wave Equalizer */}
                <div className="space-y-2">
                  {isRecording ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-rose-600 font-bold text-sm">
                        <span className="flex h-3 w-3 rounded-full bg-rose-600 animate-pulse" />
                        Listening... 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                      </div>

                      {/* Equalizer soundwave bars */}
                      <div className="flex items-center justify-center gap-1.5 h-8">
                        <span className="h-3 w-1.5 bg-rose-400 rounded-full animate-soundwave [animation-delay:0.1s]" />
                        <span className="h-6 w-1.5 bg-rose-500 rounded-full animate-soundwave [animation-delay:0.25s]" />
                        <span className="h-8 w-1.5 bg-rose-600 rounded-full animate-soundwave [animation-delay:0.4s]" />
                        <span className="h-5 w-1.5 bg-rose-500 rounded-full animate-soundwave [animation-delay:0.15s]" />
                        <span className="h-7 w-1.5 bg-rose-600 rounded-full animate-soundwave [animation-delay:0.3s]" />
                        <span className="h-4 w-1.5 bg-rose-400 rounded-full animate-soundwave [animation-delay:0.2s]" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-slate-700">Tap to Start Voice Conversation</div>
                  )}
                  <p className="text-xs text-slate-400">
                    Language: {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name || "Auto"}
                  </p>
                </div>

                {/* Live Speech Recognition Transcript Box */}
                {(interimTranscript || isRecording) && (
                  <div className="max-w-lg rounded-2xl bg-white border border-slate-200 p-4 shadow-sm text-xs text-slate-800 animate-fadeIn">
                    <span className="font-bold text-blue-600 mr-2">You:</span>
                    {interimTranscript || "Listening for your question..."}
                  </div>
                )}
              </div>

              {/* Quick Prompt Starters */}
              <div className="w-full pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                {[
                  "Improve my resume for AI Engineer role",
                  "Mera summary improve kar do",
                  "What skills are missing for this job?",
                  "Practice mock interview question",
                ].map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(starter, true)}
                    className="rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors"
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MOCK VOICE INTERVIEW STUDIO */}
          {activeTab === "interview" && (
            <div className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto bg-slate-50/20">
              {/* Interview Track Selector */}
              {!interviewSession ? (
                <div className="space-y-5 my-auto max-w-xl mx-auto text-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                    <Award className="h-3.5 w-3.5 text-indigo-600" />
                    AI Mock Interview Simulator
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Your Interview Practice Track</h2>
                  <p className="text-xs text-slate-500">
                    Realistic verbal interview simulation evaluated across STAR structure, relevance, technical depth, and filler words.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                    {INTERVIEW_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setInterviewTrack(track.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          interviewTrack === track.id
                            ? "border-blue-600 bg-blue-50/60 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xl mb-1">{track.icon}</div>
                        <div className="font-bold text-xs text-slate-900">{track.label}</div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-snug">{track.desc}</div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleStartInterview}
                    disabled={isInterviewLoading}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                    {isInterviewLoading ? "Preparing Questions..." : "Begin Mock Interview"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Active Session Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        Question {interviewHistory.length + 1} of {interviewSession.total_questions}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Track: {INTERVIEW_TRACKS.find((t) => t.id === interviewTrack)?.label}
                      </h3>
                    </div>
                    <button
                      onClick={() => setInterviewSession(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      Exit Session
                    </button>
                  </div>

                  {/* Interviewer Question Box */}
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                          AI
                        </div>
                        Interviewer Question:
                      </div>
                      <button
                        onClick={() =>
                          textToSpeech.speak(
                            interviewFeedback?.next_question || interviewSession.first_question,
                            { language: getBcp47Code(), speed: speechSpeed }
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Replay Audio
                      </button>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-relaxed">
                      "{interviewFeedback?.next_question || interviewSession.first_question}"
                    </p>
                  </div>

                  {/* Verbal / Typed Answer Input */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Your Response (Verbal or Typed):</span>
                      <button
                        onClick={toggleRecording}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          isRecording
                            ? "bg-rose-600 text-white animate-pulse"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <Mic className="h-3.5 w-3.5" />
                        {isRecording ? `Recording (${recordingSeconds}s)...` : "Answer by Voice"}
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={interviewAnswerText}
                      onChange={(e) => setInterviewAnswerText(e.target.value)}
                      placeholder="Speak using the microphone or type your STAR response (Situation ➔ Task ➔ Action ➔ Result)..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none font-medium"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmitInterviewAnswer}
                        disabled={!interviewAnswerText.trim() || isInterviewLoading}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {isInterviewLoading ? "Evaluating Answer..." : "Submit Answer"}
                      </button>
                    </div>
                  </div>

                  {/* Feedback Card */}
                  {interviewFeedback && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-emerald-600" />
                          <h4 className="text-sm font-bold text-slate-900">Answer Evaluation</h4>
                        </div>
                        <span className="rounded-full bg-emerald-600 text-white text-xs font-bold px-3 py-1 shadow-xs">
                          Score: {interviewFeedback.score}/100
                        </span>
                      </div>

                      {/* Dimension Gauges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="rounded-xl bg-white p-2.5 border border-emerald-100 shadow-xs">
                          <div className="text-[11px] text-slate-500">STAR Structure</div>
                          <div className="text-sm font-bold text-slate-900">
                            {interviewFeedback.breakdown.structure_star}/100
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-2.5 border border-emerald-100 shadow-xs">
                          <div className="text-[11px] text-slate-500">Technical Depth</div>
                          <div className="text-sm font-bold text-slate-900">
                            {interviewFeedback.breakdown.technical_depth}/100
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-2.5 border border-emerald-100 shadow-xs">
                          <div className="text-[11px] text-slate-500">Clarity</div>
                          <div className="text-sm font-bold text-slate-900">
                            {interviewFeedback.breakdown.clarity}/100
                          </div>
                        </div>
                        <div className="rounded-xl bg-white p-2.5 border border-emerald-100 shadow-xs">
                          <div className="text-[11px] text-slate-500">Filler Words</div>
                          <div className="text-sm font-bold text-slate-900">
                            {interviewFeedback.breakdown.filler_words_detected.length} detected
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed font-medium">
                        <strong>Coach Feedback:</strong> {interviewFeedback.feedback}
                      </div>

                      {interviewFeedback.improvement_tips.length > 0 && (
                        <div className="rounded-xl bg-white p-3 border border-emerald-100 text-xs text-slate-700 space-y-1">
                          <div className="font-bold text-amber-800">Growth Opportunities:</div>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                            {interviewFeedback.improvement_tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
