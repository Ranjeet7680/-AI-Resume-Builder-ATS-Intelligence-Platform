"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  FileText,
  CheckCircle2,
  Bot,
  Mic,
  Award,
  BookOpen,
  Code2,
  Share2,
  Compass,
  Briefcase,
  Layers,
  ChevronDown,
  Volume2,
  Star,
  Check,
  Linkedin,
  Github,
  Play,
} from "lucide-react";

export default function HomePage() {
  // Voice demo interactive state
  const [selectedVoiceLang, setSelectedVoiceLang] = useState("hi");
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const voiceDemos: Record<string, { prompt: string; response: string; audioText: string }> = {
    hi: {
      prompt: "मेरी प्रोफाइल को AI इंजीनियर जॉब के लिए चेक करें।",
      response: "नमस्ते! आपकी रेज़्यूमे में पायथन और मशीन लर्निंग बहुत मजबूत हैं। डॉकर और आरएजी जोड़ने से आपका स्कोर 91% हो जाएगा।",
      audioText: "नमस्ते! आपकी रेज़्यूमे में पायथन और मशीन लर्निंग बहुत मजबूत हैं। डॉकर और आरएजी जोड़ने से आपका स्कोर 91% हो जाएगा।",
    },
    en: {
      prompt: "Analyze my resume for Senior Backend Engineer.",
      response: "Your resume matches 84% of core technical requirements. Adding Redis caching and Kubernetes metrics will boost your ATS match to 94%.",
      audioText: "Your resume matches 84% of core technical requirements. Adding Redis caching and Kubernetes metrics will boost your ATS match to 94%.",
    },
    bn: {
      prompt: "আমার রেজ্যুমে কি সফটওয়্যার ইঞ্জিনিয়ারিং চাকরির জন্য প্রস্তুত?",
      response: "আপনার টেকনিক্যাল স্কিল খুব ভালো। প্রজেক্টে কিছু মেট্রিক ও ফলাফল যোগ করলে আপনার সিলেকশন রেট দ্বিগুণ হবে।",
      audioText: "আপনার টেকনিক্যাল স্কিল খুব ভালো। প্রজেক্টে কিছু মেট্রিক ও ফলাফল যোগ করলে আপনার সিলেকশন রেট দ্বিগুণ হবে।",
    },
    ta: {
      prompt: "எனது பயோடேட்டா வேலைக்கு பொருந்துகிறதா?",
      response: "வணக்கம்! உங்கள் சுயவிவரம் சிறந்த தொழில்நுட்ப திறன்களைக் கொண்டுள்ளது. திட்டங்களில் அளவிடக்கூடிய முடிவுகளைச் சேர்த்தால் ATS மதிப்பெண் 90% ஐ தாண்டும்.",
      audioText: "வணக்கம்! உங்கள் சுயவிவரம் சிறந்த தொழில்நுட்ப திறன்களைக் கொண்டுள்ளது.",
    },
    te: {
      prompt: "నా రెజ్యూమ్ ఉద్యోగానికి సరిపోతుందా?",
      response: "నమస్కారం! మీ ప్రొఫైల్ లో టెక్నికల్ స్కిల్స్ బాగున్నాయి. ప్రాజెక్ట్ ఫలితాలను మెట్రిక్స్ తో చేరిస్తే మీకు ఇంటర్వ్యూ అవకాశాలు పెరుగుతాయి.",
      audioText: "నమస్కారం! మీ ప్రొఫైల్ లో టెక్నికల్ స్కిల్స్ బాగున్నాయి.",
    },
  };

  const handlePlayVoiceDemo = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const current = voiceDemos[selectedVoiceLang] || voiceDemos.en;
      const utterance = new SpeechSynthesisUtterance(current.audioText);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsPlayingVoice(true);
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-400/15 to-purple-400/15 blur-3xl rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 backdrop-blur px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              Next-Gen AI Career Operating System
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Your AI Career{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Copilot
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
              Build better resumes, understand job requirements, optimize your applications, and prepare for interviews with conversational AI and voice intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                href="/builder/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
              >
                <Sparkles className="h-4 w-4" />
                Build My Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                Explore Platform
              </Link>
            </div>

            {/* Verified social proof trust bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-slate-700">4.9 / 5</span>
                <span>(Trusted by 1,400+ job seekers)</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> 100% ATS Verified Single-Column Formats
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Zap className="h-4 w-4 text-purple-600" /> Voice & 12 Indian Languages
              </span>
            </div>
          </div>

          {/* HERO VISUALIZATION PREVIEW COMPONENT */}
          <div className="mt-14 max-w-5xl mx-auto relative">
            {/* Floating Highlights Badges */}
            <div className="hidden sm:flex absolute -top-5 -left-4 z-20 items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs font-bold text-slate-800 dark:text-white animate-float">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>🎯 Workday & Greenhouse: 100% Parsed</span>
            </div>
            <div className="hidden sm:flex absolute -bottom-5 -right-4 z-20 items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs font-bold text-blue-700 dark:text-blue-400 animate-float-slow">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span>Google XYZ Method: +3x Interview Rate</span>
            </div>

            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:shadow-glow">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Left Widget: ATS Gauge & Resume Card */}
                <div className="md:col-span-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Live ATS Intelligence
                    </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 92% Compatibility
                  </span>
                </div>

                <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-slate-900">Senior Full Stack Engineer</span>
                    <span className="text-[11px] font-mono text-blue-600">San Francisco, CA</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full w-[92%] rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Keyword Match: 88%</span>
                    <span>Formatting: 100%</span>
                    <span>Metrics: 90%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">✓ Python & FastAPI</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">✓ Next.js & TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">✓ pgvector RAG</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">+ Add Kubernetes HPA</span>
                </div>
              </div>

              {/* Right Widget: Conversational AI Career Assistant Preview */}
              <div className="md:col-span-6 bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-blue-500 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">Career AI Copilot (Voice & Text)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    Online
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-slate-300">
                    <span className="font-semibold text-blue-400 block mb-0.5">Candidate:</span>
                    &ldquo;Tailor my resume for Anthropic&apos;s Staff Systems Engineer role and quantify my Redis bullets.&rdquo;
                  </div>
                  <div className="bg-blue-950/50 p-3 rounded-lg border border-blue-800/50 text-slate-200 leading-relaxed">
                    <span className="font-semibold text-emerald-400 block mb-0.5">Career AI:</span>
                    &ldquo;Done! Optimized bullet: &apos;Architected distributed worker queue processing 45M+ daily jobs via Redis Streams, reducing p99 latency from 320ms to 48ms.&apos; ATS score increased to 94%.&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Mic className="h-3 w-3 text-purple-400" /> Supports 12 Indian Languages + Hinglish
                  </span>
                  <Link href="/career-coach" className="text-blue-400 hover:text-blue-300 font-medium">
                    Try Live Chat →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 2. PROBLEM VS SOLUTION */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Why Traditional Job Hunting Fails
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              From Application Fatigue to Offer Letters
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              75% of resumes are never seen by human recruiters due to formatting rejections and missed keyword signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* The Problem */}
            <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-4">
              <h3 className="font-bold text-rose-900 text-lg flex items-center gap-2">
                <span>❌</span> The Friction You Face Today
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-rose-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Resumes take too long:</strong> Hours wasted wrestling layout margins in Word.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Job descriptions are confusing:</strong> Unclear what recruiters actually prioritize.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>ATS black boxes:</strong> Automatic rejections without feedback or scoring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Skill gaps remain hidden:</strong> Applying without knowing what you are missing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Inconsistent interview prep:</strong> Going in blind without realistic mock questions.</span>
                </li>
              </ul>
            </div>

            {/* The AI Solution Flow */}
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6 space-y-4">
              <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                <span>✓</span> The Career AI Operating Model
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-emerald-900 font-medium">
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">1</span>
                  <span><strong>Upload or LinkedIn Sync:</strong> Parse verified experience in seconds.</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">2</span>
                  <span><strong>Instant AI Gap Analysis:</strong> Compare resume against job requirements.</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">3</span>
                  <span><strong>1-Click Multi-Version Tailoring:</strong> Generate 5 targeted resume records.</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">4</span>
                  <span><strong>Voice Mock Interviews:</strong> Practice real technical and HR questions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 12 COMPLETE PLATFORM MODULES GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Full Suite Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              12 Integrated Career Acceleration Modules
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A comprehensive system connecting your resume, job matching, technical portfolio, voice practice, and application pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: FileText,
                title: "AI Resume Builder",
                desc: "Live WYSIWYG builder powered by Google XYZ formula and real-time ATS linting.",
                href: "/builder/new",
                tag: "Core",
              },
              {
                icon: ShieldCheck,
                title: "Resume AI Analyzer",
                desc: "Comprehensive 7-dimension diagnostic grading impact, readability, keywords, and metrics.",
                href: "/resume-health",
                tag: "Diagnostic",
              },
              {
                icon: Target,
                title: "ATS Compatibility Checker",
                desc: "Simulate Workday, Taleo, and Greenhouse parsers to guarantee 100% read rates.",
                href: "/ats-analyzer",
                tag: "100% Pass",
              },
              {
                icon: Zap,
                title: "Job Match & Tailor",
                desc: "Paste any job description to instantly align keywords, experience, and bullets.",
                href: "/tailor",
                tag: "High Impact",
              },
              {
                icon: Layers,
                title: "24+ Template Studio",
                desc: "Switch designs seamlessly across 7 industry categories without losing your content.",
                href: "/templates",
                tag: "24+ Styles",
              },
              {
                icon: Bot,
                title: "AI Career Assistant",
                desc: "Conversational coach trained on top tech company hiring rubrics and interview loops.",
                href: "/career-coach",
                tag: "Conversational",
              },
              {
                icon: Mic,
                title: "Voice Assistant & Indian Languages",
                desc: "Speak naturally in Hindi, Hinglish, Bengali, Tamil, Telugu, and 8 more Indian languages.",
                href: "/career-coach",
                tag: "Speech AI",
              },
              {
                icon: Award,
                title: "Voice Mock Interview Coach",
                desc: "Simulate technical, HR, and behavioral rounds with AI question generation and scoring.",
                href: "/career-coach",
                tag: "Interactive",
              },
              {
                icon: BookOpen,
                title: "Cover Letter Generator",
                desc: "Synthesize personalized cover letters in startup, corporate, or executive tones.",
                href: "/cover-letter",
                tag: "Fast Export",
              },
              {
                icon: Linkedin,
                title: "LinkedIn Profile Optimizer",
                desc: "Elevate your headline, About summary, and featured skills for inbound recruiter search.",
                href: "/linkedin",
                tag: "Recruiter SEO",
              },
              {
                icon: Github,
                title: "GitHub Repository Analyzer",
                desc: "Extract technical repositories and generate quantified resume project bullet points.",
                href: "/github",
                tag: "Tech Repos",
              },
              {
                icon: Compass,
                title: "Career Roadmap & Skill Gap",
                desc: "Visualize your personalized career milestones from current stack to target dream role.",
                href: "/resume-health",
                tag: "Strategic",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Link
                  key={i}
                  href={f.href}
                  className="group rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                    Open Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE AI VOICE DEMO */}
      <section className="py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800">
              Interactive Speech Demo
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              Conversational Voice Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Practice interview answers and get instant feedback in English or your native Indian language.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Language Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <span className="text-xs text-slate-400 font-medium">Select Language:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "hi", name: "Hindi (हिंदी / Hinglish)" },
                  { id: "en", name: "English (US/UK/IN)" },
                  { id: "bn", name: "Bengali (বাংলা)" },
                  { id: "ta", name: "Tamil (தமிழ்)" },
                  { id: "te", name: "Telugu (తెలుగు)" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedVoiceLang(lang.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      selectedVoiceLang === lang.id
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-300">
                  <Mic className="h-4 w-4 text-purple-400" />
                </div>
                <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-200 flex-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">You Ask (Voice or Text):</span>
                  &ldquo;{voiceDemos[selectedVoiceLang]?.prompt || voiceDemos.en.prompt}&rdquo;
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-blue-950/60 p-3.5 rounded-xl border border-blue-800/60 text-xs sm:text-sm text-blue-100 flex-1 leading-relaxed">
                  <span className="text-[10px] text-blue-300 uppercase font-bold block mb-1">AI Voice Response:</span>
                  &ldquo;{voiceDemos[selectedVoiceLang]?.response || voiceDemos.en.response}&rdquo;
                </div>
              </div>
            </div>

            {/* Play Button & Soundwave Indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handlePlayVoiceDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition"
                >
                  {isPlayingVoice ? (
                    <>
                      <Volume2 className="h-4 w-4 animate-bounce" /> Playing Speech Demo...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" /> Listen to AI Voice Response
                    </>
                  )}
                </button>

                {isPlayingVoice && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-950/80 rounded-xl border border-purple-500/40 animate-fade-in">
                    <span className="h-3 w-1 bg-purple-400 rounded-full animate-soundwave [animation-delay:0.1s]" />
                    <span className="h-4 w-1 bg-purple-300 rounded-full animate-soundwave [animation-delay:0.25s]" />
                    <span className="h-2 w-1 bg-purple-400 rounded-full animate-soundwave [animation-delay:0.4s]" />
                    <span className="h-5 w-1 bg-purple-200 rounded-full animate-soundwave [animation-delay:0.15s]" />
                    <span className="text-[10px] font-bold text-purple-300 ml-1.5">Speaking</span>
                  </div>
                )}
              </div>

              <Link
                href="/career-coach"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
              >
                Launch Full Voice Assistant <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              From Profile to Interview in 6 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Create Profile", desc: "Sync your career data with 1-click LinkedIn or start fresh." },
              { step: "02", title: "Upload Resume", desc: "Parse your existing PDF or Word file into structured sections." },
              { step: "03", title: "Add Job Description", desc: "Paste the requirements of the exact role you are targeting." },
              { step: "04", title: "AI Analyzes & Scores", desc: "Scan keyword gaps, impact metrics, and ATS compatibility." },
              { step: "05", title: "Improve & Tailor", desc: "Enhance bullets using Google XYZ formula and pick modern designs." },
              { step: "06", title: "Apply & Prepare", desc: "Export Word/PDF/TXT and practice voice interview questions." },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-xs">
                <span className="text-2xl font-black text-blue-600">{s.step}</span>
                <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Fair & Transparent
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Plans for Every Career Stage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              No hidden fees. Full access to ATS-guaranteed templates and AI tooling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 p-6 bg-white space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
                <div className="text-3xl font-black text-slate-900">₹0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
                <p className="text-xs text-slate-600">Essential tools for students and first-time resume builders.</p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> 1 Master Resume</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> 5 Core ATS Templates</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Standard ATS Analysis</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> PDF & Plain-Text Export</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl border border-slate-300 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro (Highlighted) */}
            <div className="rounded-2xl border-2 border-blue-600 p-6 bg-blue-50/20 space-y-5 relative flex flex-col justify-between shadow-lg">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full">
                Most Popular
              </span>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Pro Career</span>
                <div className="text-3xl font-black text-slate-900">₹499 <span className="text-xs font-normal text-slate-500">/ month</span></div>
                <p className="text-xs text-slate-600">For active job seekers who want 3x higher interview conversion.</p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600 font-bold" /> Unlimited Resumes & Versions</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600 font-bold" /> All 24+ Professional Templates</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600 font-bold" /> 1-Click 5-Version Generator</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600 font-bold" /> AI Job Matcher & Gap Analyzer</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-600 font-bold" /> Word (.docx) & PDF Export</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-center text-xs font-bold text-white hover:bg-blue-700 transition shadow"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-2xl border border-slate-200 p-6 bg-white space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Executive & AI</span>
                <div className="text-3xl font-black text-slate-900">₹999 <span className="text-xs font-normal text-slate-500">/ month</span></div>
                <p className="text-xs text-slate-600">Full voice interview simulation, speech coaching, and roadmap.</p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Everything in Pro Plan</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Voice-to-Voice AI Interview Coach</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> 12 Indian Languages & Hinglish</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> GitHub & LinkedIn Deep Audit</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Kanban Application Pipeline</li>
                </ul>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl border border-slate-300 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Start Premium Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Everything you need to know about our data integrity, privacy, and technology.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is my resume data secure and confidential?",
                a: "Yes. Your resume data is stored securely in encrypted databases. We do not sell your personal data or share it with third parties. You maintain 100% ownership and can delete your profile at any time.",
              },
              {
                q: "Does the AI invent or fabricate work experience?",
                a: "No. Our system operates under strict factual integrity guardrails. The AI only rephrases, quantifies, and structures candidate-provided facts without inventing past employers, degrees, or imaginary credentials.",
              },
              {
                q: "Can I export to Microsoft Word (.docx), PDF, and Plain-Text (.txt)?",
                a: "Yes! All three formats are supported natively. You can download clean .docx documents, print/save pixel-perfect PDFs, or copy plain-text ASCII format for pasting into online portal text boxes.",
              },
              {
                q: "Can I switch templates without losing my resume content?",
                a: "Absolutely. Our architecture cleanly decouples underlying content from visual presentation. You can cycle through all 24+ templates instantly without rewriting a single bullet point.",
              },
              {
                q: "Does the voice assistant work with Indian languages?",
                a: "Yes! The voice assistant supports English, Hindi, Hinglish, Bengali, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Odia, and Assamese with native speech synthesis.",
              },
              {
                q: "Can I delete my data and conversation history?",
                a: "Yes. In the Settings > Privacy tab, you can delete your uploaded resumes, clear all AI chat history, wipe voice transcripts, or permanently remove your account with a single click.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      faqOpenIndex === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {faqOpenIndex === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build Your Next Career Move?
          </h2>
          <p className="text-sm sm:text-base opacity-90 leading-relaxed">
            Join thousands of candidates who landed interviews at top tech companies, startups, and enterprises with our AI Career Copilot.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-xl hover:bg-slate-100 transition"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. PRODUCTION FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-900">
        <div className="container mx-auto px-4 sm:px-8 max-w-6xl grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              Career AI
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              The AI Career Operating System. Resume intelligence, job tailoring, ATS optimization, voice mock interviews, and application pipeline management.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              © {new Date().getFullYear()} CareerAI Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/builder/new" className="hover:text-white transition">Resume Builder</Link></li>
              <li><Link href="/templates" className="hover:text-white transition">Template Studio</Link></li>
              <li><Link href="/tailor" className="hover:text-white transition">Job Tailor</Link></li>
              <li><Link href="/career-coach" className="hover:text-white transition">Voice Interview</Link></li>
              <li><Link href="/applications" className="hover:text-white transition">Applications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Tools</h4>
            <ul className="space-y-2">
              <li><Link href="/ats-analyzer" className="hover:text-white transition">ATS Checker</Link></li>
              <li><Link href="/resume-health" className="hover:text-white transition">Resume Health</Link></li>
              <li><Link href="/github" className="hover:text-white transition">GitHub Analyzer</Link></li>
              <li><Link href="/linkedin" className="hover:text-white transition">LinkedIn Optimizer</Link></li>
              <li><Link href="/cover-letter" className="hover:text-white transition">Cover Letter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Account & Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/settings" className="hover:text-white transition">Settings</Link></li>
              <li><Link href="/profile" className="hover:text-white transition">Profile</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Portal</Link></li>
              <li><Link href="/welcome" className="hover:text-white transition">Splash Screen</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
