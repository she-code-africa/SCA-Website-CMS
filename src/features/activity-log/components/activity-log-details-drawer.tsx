// src/features/activity-log/components/activity-log-details-drawer.tsx
"use client";

import { format } from "date-fns";
import type { AuditLogEntry } from "@/features/activity-log/types";
import {
  getFriendlyAction,
  getFriendlyResource
} from "@/features/activity-log/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm break-all">{value}</p>
    </div>
  );
}

export function ActivityLogDetailsDrawer({
  open,
  onOpenChange,
  row
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: AuditLogEntry | null;
}) {
  if (!row) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Activity Details</SheetTitle>
          <SheetDescription>
            Full information for this log entry.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          <Row label="User" value={row.user?.email ?? "System (no user)"} />

          <div className="flex flex-wrap gap-2">
            <Badge>{getFriendlyAction(row)}</Badge>
            <Badge variant="secondary">{row.resourceType}</Badge>
          </div>

          <Separator />

          <Row label="Description" value={getFriendlyResource(row)} />
          <Row
            label="Record ID"
            value={
              row.resourceId ? (
                <span className="font-mono text-xs">{row.resourceId}</span>
              ) : (
                <span className="text-muted-foreground italic">
                  Not applicable
                </span>
              )
            }
          />

          <Separator />

          <Row
            label="Timestamp"
            value={
              row.timestamp
                ? format(new Date(row.timestamp), "dd MMM yyyy • HH:mm:ss")
                : "—"
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
