// src/features/chapters/components/mobile-chapter-event-card.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import type { ChapterEvent } from "@/features/chapters/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateBadgeVariant(state?: string) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary";
}

export function MobileChapterEventCard({ event }: { event: ChapterEvent }) {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium truncate">{event.title ?? "—"}</p>
        <Badge variant={stateBadgeVariant(event.eventState)}>
          {event.eventState ?? "draft"}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <span>Event: {fmtDate(event.eventDate)}</span>
        <span>Created: {fmtDate(event.createdAt)}</span>
      </div>
    </div>
  );
}
