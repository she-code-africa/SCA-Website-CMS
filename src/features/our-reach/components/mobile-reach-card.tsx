// src/features/our-reach/components/mobile-reach-card.tsx
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import type { Reach } from "@/features/our-reach/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function MobileReachCard({ reach }: { reach: Reach }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{reach.name ?? "—"}</p>
          <p className="mt-1 text-2xl font-bold text-pink-600">
            {formatNumber(reach.value ?? 0)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(reach.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(reach.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}