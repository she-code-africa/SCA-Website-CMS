// src/features/chapters/components/chapter-pagination.tsx
import { Button } from "@/components/ui/button";

interface ChapterPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function ChapterPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false
}: ChapterPaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev || isLoading}
        className="px-4 py-2"
      >
        Previous
      </Button>

      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{totalPages || 1}</span>
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        className="px-4 py-2"
      >
        Next
      </Button>
    </div>
  );
}
