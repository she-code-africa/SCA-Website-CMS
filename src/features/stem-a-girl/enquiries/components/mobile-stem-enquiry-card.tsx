// src/features/stem-a-girl/enquiries/components/mobile-stem-enquiry-card.tsx

"use client";

import type { StemEnquiry } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function MobileStemEnquiryCard({ enquiry }: { enquiry: StemEnquiry }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{enquiry.fullName}</p>
          <p className="text-xs text-muted-foreground">{enquiry.email}</p>
        </div>
        <Badge
          className={
            enquiry.status === "closed" ? "bg-green-600" : "bg-red-600"
          }
        >
          {enquiry.status}
        </Badge>
      </div>
      <p className="text-sm mt-2 font-medium">{enquiry.subject}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {enquiry.description}
      </p>
      <div className="mt-2 text-xs text-muted-foreground flex justify-between">
        <span>Updated: {fmtDate(enquiry.updatedAt)}</span>
      </div>
    </div>
  );
}
