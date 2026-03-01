// src/features/enquiries/components/mobile-enquiry-card.tsx
import { format } from "date-fns";
import type { Enquiry } from "../types";
import { Badge } from "@/components/ui/badge";

export function MobileEnquiryCard({ row }: { row: Enquiry }) {
  return (
    <div className="rounded-xl border bg-background p-4 hover:bg-muted/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            {row.fullName ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {row.email ?? "—"}
          </p>
        </div>

        <Badge variant={row.status === "closed" ? "secondary" : "default"}>
          {row.status ?? "open"}
        </Badge>
      </div>

      <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
        {row.description ?? "—"}
      </p>

      <div className="mt-2 text-xs text-muted-foreground">
        Updated:{" "}
        {row.updatedAt ? format(new Date(row.updatedAt), "dd MMM, yyyy") : "—"}
      </div>
    </div>
  );
}
