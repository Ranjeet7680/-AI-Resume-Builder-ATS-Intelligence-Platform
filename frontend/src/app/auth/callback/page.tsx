"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, setAuthToken } from "@/lib/api";
import { Sparkles } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying LinkedIn authorization...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAuthToken(token);
      setStatus("Authentication successful! Loading your dashboard...");
      setTimeout(() => router.push("/dashboard"), 500);
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state") || undefined;

    if (!code) {
      setStatus("No authorization parameters detected. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    const exchange = async () => {
      try {
        const res = await authApi.exchangeLinkedInCode(code, state);
        if (res.access_token) {
          setAuthToken(res.access_token);
          setStatus("Authentication successful! Loading your dashboard...");
          setTimeout(() => router.push("/dashboard"), 800);
        }
      } catch (err: any) {
        setStatus("Failed to exchange LinkedIn code. Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    exchange();
  }, [searchParams, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg animate-pulse mb-4">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">{status}</h2>
      <p className="text-xs text-slate-500 mt-2">Connecting with LinkedIn OpenID Connect</p>
    </div>
  );
}
