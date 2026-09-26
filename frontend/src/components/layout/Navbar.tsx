"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Home,
  Bot,
  Compass,
  CheckCircle2,
  ExternalLink,
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

  // Initialize theme from system or class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: FileText },
    { href: "/templates", label: "Templates", icon: Palette },
    { href: "/career-coach", label: "Career AI", icon: Sparkles, badge: "Voice" },
    { href: "/tailor", label: "AI Tailor", icon: Target },
    { href: "/applications", label: "Applications", icon: Briefcase },
    { href: "/builder/new", label: "Builder", icon: Plus, highlight: true },
  ];

  // Bottom navigation items for mobile
  const bottomNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/templates", label: "Templates", icon: Palette },
    { href: "/builder/new", label: "New Resume", icon: Plus, isAction: true },
    { href: "/career-coach", label: "AI Coach", icon: Sparkles },
    { href: "/applications", label: "Applications", icon: Briefcase },
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
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800 transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo with Animated Glow Icon */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-glow transition-all duration-300">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-30 blur-xs transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Career<span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  SaaS OS
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href) && link.href !== "/builder/new");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    link.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-glow"
                      : isActive
                      ? "bg-blue-50/90 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${link.highlight ? "text-white" : ""}`} />
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {isActive && !link.highlight && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Notifications, Theme, Profile, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center gap-2"
              title="Search tools & features (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline text-xs text-slate-400 font-medium">Quick search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition relative"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Live Notifications</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                      Mark read
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-0.5 transition ${
                          n.unread
                            ? "bg-blue-50/60 border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/60"
                            : "bg-white border-slate-100 dark:bg-slate-800/40 dark:border-slate-800"
                        }`}
                      >
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{n.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{n.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  A
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">Alex</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Alex Chen</span>
                    <span className="text-[10px] text-slate-400 block truncate">alex.chen.dev@example.com</span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <User className="h-4 w-4 text-slate-500" /> My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <FileText className="h-4 w-4 text-slate-500" /> My Resumes
                  </Link>
                  <Link
                    href="/applications"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Briefcase className="h-4 w-4 text-slate-500" /> Job Applications
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <BarChart3 className="h-4 w-4 text-slate-500" /> Career Analytics
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Settings className="h-4 w-4 text-slate-500" /> Settings & Billing
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                  >
                    <ShieldAlert className="h-4 w-4 text-blue-600" /> Admin Portal
                  </Link>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Sheet */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 space-y-2 animate-slide-down shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <Link
                href="/builder/new"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25"
              >
                <Plus className="h-4 w-4" /> Create New Resume
              </Link>
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href) && link.href !== "/builder/new";
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[9px] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 px-2">
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
              >
                <Settings className="h-3.5 w-3.5" /> Settings
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold"
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modern Fixed Bottom Navigation Bar for Mobile Phones */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 safe-pb flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 group"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-active:scale-95 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  Build
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Jump to: Builder, Templates, Tailor, Voice, Settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Quick Shortcuts
              </span>
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
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold transition"
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-400 text-[10px]">Jump ➔</span>
                  </Link>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
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
