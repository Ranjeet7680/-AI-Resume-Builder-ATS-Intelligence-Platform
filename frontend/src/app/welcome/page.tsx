"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Sun, Moon } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Initializing neural career engine...");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Analyzing your career journey & industry benchmarks...");
    }, 700);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Calibrating 24+ ATS-guaranteed templates & AI copilot...");
    }, 1500);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Ready! Launching AI Career Copilot...");
    }, 2200);

    const timer4 = setTimeout(() => {
      router.push("/");
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [router]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 transition-colors duration-500 relative overflow-hidden select-none ${
        isDarkMode
          ? "bg-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 text-slate-900"
      }`}
    >
      {/* Background Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight text-sm">
            CAREER <span className="text-blue-500">AI</span>
          </span>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-xl border text-xs transition ${
            isDarkMode
              ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              : "border-slate-200 bg-white text-slate-700 hover:text-slate-900"
          }`}
          title="Toggle Light/Dark Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Center Hero Splash Animation */}
      <div className="flex flex-col items-center text-center max-w-md z-10 space-y-6">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-600/30 animate-bounce">
            <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CAREER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">AI</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium opacity-80 mt-1 uppercase tracking-widest">
            Your AI Career Copilot
          </p>
        </div>

        {/* Dynamic Status Text */}
        <p className="text-xs sm:text-sm opacity-90 h-6 transition-all duration-300">
          {statusText}
        </p>

        {/* Progress Bar */}
        <div className="w-64 sm:w-72 space-y-2">
          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] opacity-60">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Subtle pulsing dots */}
        <div className="flex items-center gap-2 pt-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse delay-200" />
          <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-500" />
        </div>
      </div>

      {/* Bottom Skip CTA */}
      <div className="z-10">
        <button
          onClick={() => router.push("/")}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            isDarkMode
              ? "text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800"
              : "text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200"
          }`}
        >
          Enter Platform Now <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
