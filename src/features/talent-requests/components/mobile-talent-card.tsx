// src/features/talent-requests/components/mobile-talent-card.tsx
import { format } from "date-fns";
import type { TalentRequest, TalentRequestStatus } from "../types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function statusVariant(status?: TalentRequestStatus) {
  if (status === "Approved") return "default";
  if (status === "Rejected") return "destructive";
  return "secondary";
}

export function MobileTalentCard({ row }: { row: TalentRequest }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {row.fullname ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {row.email ?? "—"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={statusVariant(row.status)}>
              {row.status ?? "Pending"}
            </Badge>
            {row.jobRole ? (
              <Badge variant="outline">{row.jobRole}</Badge>
            ) : null}
            {row.experienceLevel ? (
              <Badge variant="outline">{row.experienceLevel}</Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Company</span>
          <span className="max-w-[70%] truncate text-right">
            {row.company ?? "—"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(row.updatedAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(row.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
