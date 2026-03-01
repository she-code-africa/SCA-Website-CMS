// src/features/companies/components/mobile-company-card.tsx
import { format } from "date-fns";
import { Building2, MapPin, Phone, Mail } from "lucide-react";
import type { Company } from "@/features/companies/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateVariant(state?: string) {
  if (state === "active") return "default";
  return "secondary"; // archived
}

export function MobileCompanyCard({ company }: { company: Company }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {company.companyName ?? "—"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {company.email ?? "—"}
              </p>
            </div>
          </div>
          <Badge variant={stateVariant(company.state)}>
            {company.state ?? "active"}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid gap-2 text-xs">
          {company.companyLocation && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{company.companyLocation}</span>
            </div>
          )}
          {company.companyPhone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span className="truncate">{company.companyPhone}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-muted-foreground">Updated</span>
            <span>{fmtDate(company.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
