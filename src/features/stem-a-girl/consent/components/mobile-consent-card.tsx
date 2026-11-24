// src/features/stem-a-girl/consent/components/mobile-consent-card.tsx

"use client";

import type { ConsentRecord } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/features/stem-a-girl/shared/format";
import { AccountStatusBadge, ConsentStateBadge } from "./consent-badges";

export function MobileConsentCard({ record }: { record: ConsentRecord }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm transition-colors hover:bg-muted/50">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{record.name}</p>
        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
          {record.username}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          Guardian: {record.guardianEmail}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <ConsentStateBadge state={record.consentStatus} />
        <AccountStatusBadge status={record.accountStatus} />
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Age</span>
          <span>{record.age}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(record.consentSubmittedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export function MobileConsentSkeletonCard() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-28" />
      <Skeleton className="mt-2 h-3 w-48" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}
