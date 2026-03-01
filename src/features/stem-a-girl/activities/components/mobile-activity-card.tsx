// src/features/stem-a-girl/activities/components/mobile-activity-card.tsx
"use client";

import { format } from "date-fns";
import type { SAGActivity } from "../types";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(title?: string) {
  const parts = (title ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

export function MobileActivityCard({ activity }: { activity: SAGActivity }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {activity.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.image}
            alt={activity.title}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {initials(activity.title)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {activity.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {activity.description ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(activity.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(activity.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
