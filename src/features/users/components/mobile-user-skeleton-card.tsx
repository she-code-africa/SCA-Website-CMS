import { Skeleton } from "@/components/ui/skeleton";

export function MobileUserSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
