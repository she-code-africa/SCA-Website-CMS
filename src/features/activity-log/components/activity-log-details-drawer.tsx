"use client";

import * as React from "react";
import { format } from "date-fns";

import type { ActivityLogRow } from "@/features/activity-log/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function pretty(s?: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy • p");
}

export function ActivityLogDetailsDrawer({
  open,
  onOpenChange,
  row
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: ActivityLogRow | null;
}) {
  const user = row?.user
    ? `${row.user.firstName ?? ""} ${row.user.lastName ?? ""}`.trim()
    : "—";

  const role = pretty(row?.user?.role);
  const action = pretty(row?.action);
  const page = row?.page ?? "—";

  const oldDoc = row?.oldDoc?.name ?? "N/A";
  const newDoc = row?.newDoc?.name ?? "—";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* For mobile you can use side="bottom" if you prefer.
          Right-side drawer works well on tablet/desktop. */}
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Activity Details</SheetTitle>
          <SheetDescription>
            Full information for this log entry.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">User</p>
            <p className="font-medium">{user}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">{role}</Badge>
              <Badge>{action}</Badge>
              <Badge variant="outline">{page}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Old</span>
              <span className="max-w-[70%] truncate text-right">{oldDoc}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">New</span>
              <span className="max-w-[70%] truncate text-right">{newDoc}</span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Created</span>
              <span className="text-right">{fmtDate(row?.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Updated</span>
              <span className="text-right">{fmtDate(row?.updatedAt)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
