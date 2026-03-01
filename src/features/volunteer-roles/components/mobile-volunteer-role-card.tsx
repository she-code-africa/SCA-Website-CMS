// src/features/volunteer-roles/components/mobile-volunteer-role-card.tsx
"use client";

import type { VolunteerRole } from "../types";

export function MobileVolunteerRoleCard({ row }: { row: VolunteerRole }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{row.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {row.description}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(row.skills ?? []).slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
        {(row.skills ?? []).length > 4 ? (
          <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            +{row.skills.length - 4}
          </span>
        ) : null}
      </div>
    </div>
  );
}
