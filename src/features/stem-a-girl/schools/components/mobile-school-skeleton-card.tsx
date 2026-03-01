// src/features/stem-a-girl/schools/components/mobile-school-skeleton-card.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MobileSchoolSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
