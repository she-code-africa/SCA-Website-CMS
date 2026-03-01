// src/features/activity-log/components/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { ActivityLogRow } from "@/features/activity-log/types";

export const columns: ColumnDef<ActivityLogRow>[] = [
  {
    id: "user",
    header: "User",
    cell: ({ row }) => {
      const u = row.original.user;
      return (
        <div className="font-medium">
          {u?.firstName} {u?.lastName}
        </div>
      );
    }
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.user?.role ?? "";
      const pretty = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
      return <div className="text-muted-foreground">{pretty}</div>;
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action ?? "";
      const pretty = action
        ? action.charAt(0).toUpperCase() + action.slice(1)
        : "";
      return <div>{pretty}</div>;
    }
  },
  { accessorKey: "page", header: "Page" },
  {
    id: "oldDoc",
    header: "Old",
    cell: ({ row }) => <div>{row.original.oldDoc?.name ?? "N/A"}</div>
  },
  {
    id: "newDoc",
    header: "New",
    cell: ({ row }) => <div>{row.original.newDoc?.name ?? ""}</div>
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "dd MMM, yyyy")
          : ""}
      </div>
    )
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.updatedAt
          ? format(new Date(row.original.updatedAt), "dd MMM, yyyy")
          : ""}
      </div>
    )
  }
];
