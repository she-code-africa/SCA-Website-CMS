// src/components/templates/table-frame.tsx
import * as React from "react";
import { cn } from "@/lib/utils/utils";

export function TableFrame({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40",
        className
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
