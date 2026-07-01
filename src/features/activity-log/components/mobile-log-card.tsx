// src/features/activity-log/components/mobile-log-card.tsx

import { format } from "date-fns";
import type { AuditLogEntry } from "@/features/activity-log/types";
import {
  getFriendlyAction,
  getFriendlyResource,
  getUserDisplay
} from "@/features/activity-log/utils";

export function MobileLogCard({ row }: { row: AuditLogEntry }) {
  const { name, email, isSystem } = getUserDisplay(row.user);
  const action = getFriendlyAction(row);
  const resource = getFriendlyResource(row);
  const timestamp = row.timestamp
    ? format(new Date(row.timestamp), "dd MMM yyyy, HH:mm:ss")
    : "—";

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {isSystem ? (
              <span className="italic text-muted-foreground">{name}</span>
            ) : (
              name
            )}
          </p>
          {!isSystem && email && (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{resource}</p>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {action}
        </span>
      </div>

      {row.resourceId && (
        <p className="mt-3 font-mono text-[11px] text-muted-foreground truncate">
          ID: {row.resourceId}
        </p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">{timestamp}</p>
    </div>
  );
}
