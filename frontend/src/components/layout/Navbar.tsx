"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FileText, CheckCircle2, Target, LogIn } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FileText },
    { href: "/career-coach", label: "🎙️ Career Coach", icon: Sparkles },
    { href: "/tailor", label: "🎯 AI Tailor", icon: Target },
    { href: "/builder/new", label: "Resume Builder", icon: Sparkles },
    { href: "/ats-analyzer", label: "ATS Analyzer", icon: CheckCircle2 },
    { href: "/cover-letter", label: "Cover Letter", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Resume<span className="text-blue-600">AI</span>
            </span>
            <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              LinkedIn
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
          >
            <LogIn className="h-4 w-4" />
            Sign In with LinkedIn
          </Link>
        </div>
      </div>
    </header>
  );
}
