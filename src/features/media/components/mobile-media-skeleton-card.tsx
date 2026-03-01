import { Skeleton } from "@/components/ui/skeleton";

export function MobileMediaSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-16 w-16 rounded-lg shrink-0" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
