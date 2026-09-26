"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Linkedin, Sparkles, UploadCloud, ArrowRight, ShieldCheck } from "lucide-react";
import { authApi, setAuthToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUploading(true);
    setError(null);
    try {
      const res = await authApi.uploadLinkedInPdf(file);
      // Auto login as demo user and load imported profile data
      const authRes = await authApi.demoLogin();
      setAuthToken(authRes.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to parse LinkedIn PDF");
    } finally {
      setPdfUploading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to ResumeAI</h2>
          <p className="text-xs text-slate-500">
            Authenticate securely and sync your professional career profile
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white py-3 px-4 text-sm font-semibold shadow transition"
          >
            <Linkedin className="h-5 w-5" />
            Continue with LinkedIn
          </button>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-3 px-4 text-sm font-semibold transition"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            Instant Sandbox Demo Sign In
            <ArrowRight className="h-4 w-4 ml-auto" />
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-semibold">Or import existing profile</span>
          </div>
        </div>

        {/* Upload LinkedIn Profile PDF */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition">
          <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-slate-700">
            {pdfUploading ? "Parsing Profile PDF..." : "Upload LinkedIn Profile PDF"}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            LinkedIn &gt; More &gt; Save to PDF
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfUpload}
            disabled={pdfUploading}
            className="hidden"
          />
        </label>

        <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          OAuth 2.0 / OIDC Verified Security
        </div>
      </div>
    </div>
  );
}
