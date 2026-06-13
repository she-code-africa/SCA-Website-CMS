import { Skeleton } from "@/components/ui/skeleton";

export function MobileReportLogSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}
