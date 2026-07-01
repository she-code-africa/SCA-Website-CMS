// src/features/partners/components/mobile-partner-card.tsx
import { format } from "date-fns";
import { Building2 } from "lucide-react";
import type { Partner } from "@/features/partners/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function MobilePartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {partner.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.image}
            alt={partner.name}
            className="h-12 w-12 rounded-full object-cover border"
          />
        ) : (
          <div className="h-12 w-12 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {initials(partner.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {partner.name ?? "—"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={partner.featured ? "default" : "secondary"}>
              {partner.featured ? "Featured" : "Standard"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(partner.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(partner.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}