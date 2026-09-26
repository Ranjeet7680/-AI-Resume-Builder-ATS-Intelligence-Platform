"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X, Lightbulb, Zap, ShieldCheck } from "lucide-react";
import { adminApi } from "@/lib/api";
import { CampaignItem } from "@/types/saas";

interface PromotionBannerProps {
  targetPage?: string;
  defaultCampaign?: Partial<CampaignItem>;
}

export default function PromotionBanner({ targetPage = "dashboard", defaultCampaign }: PromotionBannerProps) {
  const [campaign, setCampaign] = useState<CampaignItem | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const campaigns = await adminApi.listCampaigns(targetPage);
        const active = campaigns.find((c) => c.is_active);
        if (active) {
          setCampaign(active);
        } else if (defaultCampaign) {
          setCampaign(defaultCampaign as CampaignItem);
        }
      } catch {
        // Fallback tip
        setCampaign({
          id: "default-tip",
          title: "✨ High-Impact Career Tip",
          description: "Resumes with 3+ quantified outcome metrics receive 2.4x more interview invitations.",
          cta_text: "Improve Bullets with AI",
          cta_url: "/builder/new",
          campaign_type: "career_tip",
          target_page: targetPage,
          is_active: true,
          impression_count: 0,
          click_count: 0,
        });
      }
    }
    loadCampaign();
  }, [targetPage, defaultCampaign]);

  if (isDismissed || !campaign || !campaign.is_active) {
    return null;
  }

  const isTip = campaign.campaign_type === "career_tip";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 sm:p-5 transition-all shadow-xs ${
        isTip
          ? "bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 border-amber-200 text-amber-950"
          : "bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/90 border-blue-200 text-slate-900"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isTip ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
            }`}
          >
            {isTip ? <Lightbulb className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                {isTip ? "Pro Tip" : "Recommended"}
              </span>
              <span className="font-bold text-sm text-slate-900">{campaign.title}</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-2xl">
              {campaign.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <a
            href={campaign.cta_url}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition ${
              isTip
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {campaign.cta_text} <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-black/5 transition"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
