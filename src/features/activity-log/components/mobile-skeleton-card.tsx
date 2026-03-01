// src/features/activity-log/components/mobile-skeleton-card.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function MobileSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-44" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-44" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
