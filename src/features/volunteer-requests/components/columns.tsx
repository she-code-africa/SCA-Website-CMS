// src/features/volunteers/components/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type {
  VolunteerRequest,
  VolunteerStatus
} from "@/features/volunteer-requests/types";
import { Badge } from "@/components/ui/badge";

function statusBadgeVariant(status?: VolunteerStatus) {
  if (status === "Approved") return "default";
  if (status === "Rejected") return "destructive";
  return "secondary"; // Pending
}

export const columns: ColumnDef<VolunteerRequest>[] = [
  { accessorKey: "fullname", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "currentRole", header: "Current Role" },
  { accessorKey: "purpose", header: "Purpose" },
  { accessorKey: "volunteerRole", header: "Volunteer Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusBadgeVariant(row.original.status)}>
        {row.original.status ?? "Pending"}
      </Badge>
    )
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.updatedAt
          ? format(new Date(row.original.updatedAt), "dd MMM, yyyy")
          : "—"}
      </span>
    )
  }
];
