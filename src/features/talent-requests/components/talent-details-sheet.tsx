// src/features/talent-requests/components/talent-details-sheet.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { TalentRequest } from "../types";
import { getTalentRequest } from "../api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: TalentRequest | null;
};

function badgeVariant(status?: string) {
  if (status === "Approved") return "default";
  if (status === "Rejected") return "destructive";
  return "secondary";
}

export function TalentRequestDetailsSheet({ open, onOpenChange, row }: Props) {
    const t = row;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>Talent Request Details</SheetTitle>
          <SheetDescription>
            View submitted talent request details.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {!t ? (
              <p className="text-sm text-muted-foreground">
                No request selected.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={badgeVariant(t.status)}>
                    {t.status ?? "Pending"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" value={t.fullname} />
                  <Field label="Email" value={t.email} />
                  <Field label="Experience Level" value={t.experienceLevel} />
                  <Field label="Job Role" value={t.jobRole} />
                  <Field label="Company" value={t.company} />
                  <Field label="Company Link" value={t.companyLink} />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Job Description</label>
                  <div className="rounded-md border px-3 py-2 text-sm bg-muted/50 min-h-[120px] whitespace-pre-wrap">
                    {t.jobDescription ?? "—"}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
        {value?.trim() ? value : "—"}
      </div>
    </div>
  );
}
