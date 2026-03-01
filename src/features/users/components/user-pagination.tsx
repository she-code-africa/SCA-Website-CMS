import { Button } from "@/components/ui/button";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading: boolean;
}

export function UserPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isLoading
}: UserPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-2 sm:justify-end">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage <= 1 || isLoading}
        className="w-full sm:w-auto"
      >
        Prev
      </Button>
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        Page <span className="text-foreground">{currentPage}</span> /{" "}
        {Math.max(1, totalPages)}
      </div>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage >= totalPages || isLoading}
        className="w-full sm:w-auto"
      >
        Next
      </Button>
    </div>
  );
}
