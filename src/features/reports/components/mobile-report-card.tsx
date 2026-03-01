// src/features/reports/components/mobile-report-card.tsx
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import type { Report } from "@/features/reports/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function MobileReportCard({ report }: { report: Report }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Annual Report</p>
            <Badge variant="outline">{report.year ?? "—"}</Badge>
          </div>

          <a
            href={report.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate max-w-[200px]">{report.link ?? "—"}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(report.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(report.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
