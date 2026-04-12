// src/features/activity-log/components/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { AuditLogEntry } from "@/features/activity-log/types";
import {
  getFriendlyAction,
  getFriendlyResource
} from "@/features/activity-log/utils";

export const columns: ColumnDef<AuditLogEntry>[] = [
  {
    id: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.user?.email ?? (
          <span className="text-muted-foreground italic">System</span>
        )}
      </div>
    )
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <div>{getFriendlyAction(row.original)}</div>
  },
  {
    id: "resource",
    header: "Resource",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">
        {getFriendlyResource(row.original)}
      </div>
    )
  },
  {
    id: "resourceId",
    header: "Record ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground max-w-35 truncate">
        {row.original.resourceId ?? <span className="italic">—</span>}
      </div>
    )
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) =>
      row.original.timestamp ? (
        <div className="text-muted-foreground whitespace-nowrap">
          {format(new Date(row.original.timestamp), "dd MMM yyyy, HH:mm:ss")}
        </div>
      ) : (
        "—"
      )
  }
];
