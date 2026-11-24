// src/features/stem-a-girl/shared/table-pagination.tsx

import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
};

export function TablePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isLoading,
}: Props) {
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
