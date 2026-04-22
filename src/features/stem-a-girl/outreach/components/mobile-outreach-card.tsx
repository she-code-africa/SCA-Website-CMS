// src/features/stem-a-girl/outreach/components/mobile-outreach-card.tsx

"use client";

import type { Outreach } from "../types";
import { format } from "date-fns";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function MobileOutreachCard({ outreach }: { outreach: Outreach }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        {outreach.coverImage ? (
          <img
            src={outreach.coverImage}
            alt={outreach.state}
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-lg">
            📸
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold">{outreach.state}</p>
          <p className="text-xs text-muted-foreground">
            {fmtDate(outreach.outreachDate)}
          </p>
          <p className="text-sm line-clamp-2 mt-1">{outreach.description}</p>
          {outreach.totalImages !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {outreach.totalImages} images
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
