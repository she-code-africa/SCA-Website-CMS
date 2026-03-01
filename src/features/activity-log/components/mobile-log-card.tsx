// src/features/activity-log/components/mobile-log-card.tsx
import { format } from "date-fns";
import type { ActivityLogRow } from "@/features/activity-log/types";

function prettyRole(role?: string) {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function prettyAction(action?: string) {
  if (!action) return "";
  return action.charAt(0).toUpperCase() + action.slice(1);
}

interface MobileLogCardProps {
  row: ActivityLogRow;
}

export function MobileLogCard({ row }: MobileLogCardProps) {
  const user =
    `${row.user?.firstName ?? ""} ${row.user?.lastName ?? ""}`.trim() || "—";
  const role = prettyRole(row.user?.role) || "—";
  const action = prettyAction(row.action) || "—";
  const page = row.page ?? "—";
  const oldDoc = row.oldDoc?.name ?? "N/A";
  const newDoc = row.newDoc?.name ?? "—";
  const created = row.createdAt
    ? format(new Date(row.createdAt), "dd MMM, yyyy")
    : "—";
  const updated = row.updatedAt
    ? format(new Date(row.updatedAt), "dd MMM, yyyy")
    : "—";

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {role} • {action}
          </p>
        </div>

        <div className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          {page}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Old</span>
          <span className="max-w-[70%] truncate text-right">{oldDoc}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">New</span>
          <span className="max-w-[70%] truncate text-right">{newDoc}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Created</span>
          <span className="text-right">{created}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Updated</span>
          <span className="text-right">{updated}</span>
        </div>
      </div>
    </div>
  );
}
