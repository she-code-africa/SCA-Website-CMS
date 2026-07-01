import { format } from "date-fns";
import type { School } from "@/features/schools/types";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function MobileSchoolCard({ school }: { school: School }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="space-y-2">
        <p className="text-sm font-semibold">{school.name ?? "—"}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {school.description ?? "No description"}
        </p>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(school.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(school.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
