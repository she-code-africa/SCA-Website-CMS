// src/features/enquiries/components/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Enquiry } from "../types";
import { Badge } from "@/components/ui/badge";

function statusVariant(status?: string) {
  if (status === "closed") return "secondary";
  return "default"; // open
}

export const columns: ColumnDef<Enquiry>[] = [
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "description",
    header: "Message",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-[420px] text-muted-foreground">
        {row.original.description ?? "—"}
      </span>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {row.original.status ?? "open"}
      </Badge>
    )
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) =>
      row.original.updatedAt
        ? format(new Date(row.original.updatedAt), "dd MMM, yyyy")
        : "—"
  }
];
