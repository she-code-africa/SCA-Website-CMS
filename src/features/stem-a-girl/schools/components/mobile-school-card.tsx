// src/features/stem-a-girl/schools/components/mobile-school-card.tsx
"use client";

import { format } from "date-fns";
import type { SAGSchool } from "../types";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

export function MobileSchoolCard({ school }: { school: SAGSchool }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {school.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={school.image}
            alt={school.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {initials(school.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{school.name ?? "—"}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {school.description ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(school.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(school.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
