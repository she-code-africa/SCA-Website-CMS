"use client";

import { format } from "date-fns";
import type { SagEvent } from "@/features/sag-events/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function activityTitle(e: SagEvent) {
  return typeof e.activity === "string"
    ? e.activity
    : (e.activity?.title ?? "—");
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

export function MobileEventCard({ event }: { event: SagEvent }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {initials(event.title)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{event.title ?? "—"}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activityTitle(event)} • {event.state ?? "—"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {event.state ? (
              <Badge variant="secondary">{event.state}</Badge>
            ) : null}
            {event.eventDate ? (
              <Badge variant="outline">{fmtDate(event.eventDate)}</Badge>
            ) : (
              <Badge variant="outline">No date</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(event.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(event.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
