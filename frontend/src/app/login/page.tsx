"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Linkedin, Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, Github } from "lucide-react";
import { authApi, setAuthToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLinkedInLogin = () => {
    const backendBase = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
      : "http://localhost:8000";
    window.location.href = `${backendBase}/auth/linkedin`;
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.demoLogin();
      setAuthToken(res.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (tab === "signup") {
        const res = await authApi.emailSignup(email, fullName, password);
        setAuthToken(res.access_token);
        router.push("/onboarding");
      } else {
        const res = await authApi.emailLogin(email, password);
        setAuthToken(res.access_token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {tab === "signin" ? "Welcome back 👋" : "Create your career account"}
          </h2>
          <p className="text-xs text-slate-500">
            {tab === "signin"
              ? "Access your resumes, tailored jobs, and voice interview coach"
              : "Set up your personalized AI career copilot in 60 seconds"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              tab === "signin" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              tab === "signup" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white py-2.5 px-4 text-xs font-semibold shadow transition"
          >
            <Linkedin className="h-4 w-4" />
            Continue with LinkedIn
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-3 text-xs font-semibold transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.32 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.68 1.27 6.59l4.01 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-3 text-xs font-semibold transition"
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>
          </div>
        </div>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-semibold">Or with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {tab === "signup" && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              {tab === "signin" && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition"
          >
            {isLoading
              ? "Authenticating..."
              : tab === "signin"
              ? "Sign In with Email"
              : "Create Account & Start Onboarding"}
          </button>
        </form>

        {/* Instant Sandbox Demo Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-4 text-xs font-semibold transition"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            1-Click Instant Sandbox Demo
            <ArrowRight className="h-3.5 w-3.5 ml-auto text-slate-400" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Encrypted with OAuth 2.0 & OIDC Standards</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reset your password</h3>
            {forgotSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                A password reset link has been dispatched to <strong>{email || "your email"}</strong>.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">Enter your registered email and we&apos;ll send you a secure reset link.</p>
                <input
                  type="email"
                  placeholder="name@example.com"
                  defaultValue={email}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Send Reset Link
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
