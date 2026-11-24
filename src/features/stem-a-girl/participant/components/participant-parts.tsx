// src/features/stem-a-girl/participants/components/participant-parts.tsx
// Small pieces used by both the table and the mobile card.

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import type { LearnerStatus } from "@/features/stem-a-girl/shared/types";

export function ParticipantStatusBadge({ status }: { status: LearnerStatus }) {
  if (status === "Active") return <Badge className="bg-green-600">Active</Badge>;
  if (status === "Completed") {
    return <Badge className="bg-blue-600">Completed</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
}

export function CompletedTag({ title }: { title?: string }) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700"
    >
      <Check className="h-3 w-3" />
      Completed
    </span>
  );
}

export function CompletionBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 70 ? "bg-green-600" : "bg-primary",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold">{value}%</span>
    </div>
  );
}
