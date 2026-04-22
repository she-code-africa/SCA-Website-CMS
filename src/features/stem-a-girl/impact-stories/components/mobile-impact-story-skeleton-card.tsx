// src/features/stem-a-girl/impact-stories/components/mobile-impact-story-skeleton-card.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function MobileImpactStorySkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
