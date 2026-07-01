// src/features/activity-log/components/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { AuditLogEntry } from "@/features/activity-log/types";
import {
  getFriendlyAction,
  getFriendlyResource,
  getUserDisplay
} from "@/features/activity-log/utils";

export const columns: ColumnDef<AuditLogEntry>[] = [
  {
    id: "user",
    header: "User",
    cell: ({ row }) => {
      const { name, email, isSystem } = getUserDisplay(row.original.user);
      if (isSystem) {
        return <span className="italic text-muted-foreground">{name}</span>;
      }
      return (
        <div>
          <div className="font-medium">{name}</div>
          {email && (
            <div className="text-xs text-muted-foreground">{email}</div>
          )}
        </div>
      );
    }
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
