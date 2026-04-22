// src/features/stem-a-girl/impact-stories/components/impact-stories-pagination.tsx

import { Button } from "@/components/ui/button";

export function ImpactStoriesPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isLoading
}: any) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage <= 1 || isLoading}
      >
        Prev
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage >= totalPages || isLoading}
      >
        Next
      </Button>
    </div>
  );
}
