"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  FileText,
  Target,
  LogIn,
  Palette,
  Bell,
  Search,
  User,
  Settings,
  Briefcase,
  BarChart3,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { clearAuthToken } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FileText },
    { href: "/templates", label: "Templates", icon: Palette },
    { href: "/career-coach", label: "Career AI", icon: Sparkles },
    { href: "/tailor", label: "AI Tailor", icon: Target },
    { href: "/applications", label: "Applications", icon: Briefcase },
    { href: "/builder/new", label: "Builder", icon: FileText },
  ];

  const handleLogout = () => {
    clearAuthToken();
    setShowProfileMenu(false);
    router.push("/login");
  };

  const notifications = [
    { id: 1, title: "Interview Reminder", desc: "ScaleAI Systems Design round in 2 days", unread: true },
    { id: 2, title: "ATS Optimization", desc: "New keyword match recommendations for Anthropic role", unread: true },
    { id: 3, title: "Template Studio Updated", desc: "Added 24+ industry tailored designs", unread: false },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Career<span className="text-blue-600">AI</span>
              </span>
              <span className="ml-1.5 hidden sm:inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                SaaS OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Notifications, Theme, Profile */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Search tools & resumes"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                          n.unread ? "bg-blue-50/50 border-blue-100" : "bg-white border-slate-100"
                        }`}
                      >
                        <span className="font-bold text-slate-900 block">{n.title}</span>
                        <span className="text-[11px] text-slate-500 block">{n.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition hidden sm:inline-flex"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700">Alex</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 block">Alex Chen</span>
                    <span className="text-[10px] text-slate-400 block truncate">alex.chen.dev@example.com</span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" /> My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate-500" /> My Resumes
                  </Link>
                  <Link
                    href="/applications"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-slate-500" /> Application Pipeline
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-slate-500" /> Career Analytics
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-500" /> Settings & Billing
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 rounded-lg hover:bg-blue-50 transition"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 text-blue-600" /> Admin Portal
                  </Link>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <link.icon className="h-4 w-4 text-blue-600" />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Jump to tool: Builder, Templates, Tailor, Voice, Settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block px-2">Quick Shortcuts</span>
              {[
                { label: "Resume Builder", href: "/builder/new" },
                { label: "Multi-Template Studio", href: "/templates" },
                { label: "AI Job Tailor", href: "/tailor" },
                { label: "Voice Mock Interview Coach", href: "/career-coach" },
                { label: "Application Tracker Kanban", href: "/applications" },
                { label: "GitHub Repository Analyzer", href: "/github" },
                { label: "LinkedIn Optimizer", href: "/linkedin" },
                { label: "Career Analytics", href: "/analytics" },
                { label: "Platform Settings", href: "/settings" },
              ]
                .filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setShowSearchModal(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium"
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-400 text-[10px]">Jump ➔</span>
                  </Link>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
