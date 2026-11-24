// src/features/stem-a-girl/participants/components/mobile-participant-card.tsx

"use client";

import type { Participant } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/features/stem-a-girl/shared/format";
import {
  CompletedTag,
  CompletionBar,
  ParticipantStatusBadge,
} from "./participant-parts";

export function MobileParticipantCard({
  participant: p,
}: {
  participant: Participant;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{p.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {p.email}
          </p>
        </div>
        <ParticipantStatusBadge status={p.status} />
      </div>

      <div className="mt-3 grid gap-1.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span>{p.course}</span>
          {p.status === "Completed" && <CompletedTag />}
        </div>
        {p.completedCourse && (
          <div className="flex items-center justify-between gap-2">
            <span>{p.completedCourse}</span>
            <CompletedTag
              title={`Completed on ${fmtDate(p.completedCourseDate)}`}
            />
          </div>
        )}
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Age</span>
          <span>{p.age}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Country</span>
          <span>{p.country}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Enrolled</span>
          <span>{fmtDate(p.enrolledDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Completion</span>
          <CompletionBar value={p.completion} />
        </div>
      </div>
    </div>
  );
}

export function MobileParticipantSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-48" />
      <Skeleton className="mt-3 h-3 w-32" />
      <Skeleton className="mt-3 h-3 w-full" />
    </div>
  );
}
