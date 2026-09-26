import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreColor(score: number): { text: string; bg: string; border: string } {
  if (score >= 80) {
    return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
  }
  if (score >= 60) {
    return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
  }
  return { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" };
}
