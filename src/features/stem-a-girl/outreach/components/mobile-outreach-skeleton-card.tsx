// src/features/stem-a-girl/outreach/components/mobile-outreach-skeleton-card.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function MobileOutreachSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="h-12 w-12 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    </div>
  );
}
