// src/features/chapters/components/mobile-chapter-lead-card.tsx
"use client";

import * as React from "react";
import type { ChapterLead } from "@/features/chapters/types";

function getInitials(name: string): string {
  return (name || "—")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MobileChapterLeadCard({ lead }: { lead: ChapterLead }) {
  const socials = lead.socialMediaLinks || {};
  const socialCount = Object.keys(socials).length;

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-3">
        {lead.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lead.image}
            alt={lead.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
            {getInitials(lead.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{lead.name ?? "—"}</p>
          <p className="text-sm text-muted-foreground truncate">
            {lead.role ?? "—"}
          </p>
        </div>

        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {socialCount ? `${socialCount} link(s)` : "No links"}
        </div>
      </div>
    </div>
  );
}
