// src/features/stem-a-girl/enquiries/components/mobile-stem-enquiry-skeleton-card.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function MobileStemEnquirySkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
