// src/features/talent-requests/components/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { TalentRequest, TalentRequestStatus } from "../types";
import { Badge } from "@/components/ui/badge";

function statusBadgeVariant(status?: TalentRequestStatus) {
  if (status === "Approved") return "default";
  if (status === "Rejected") return "destructive";
  return "secondary";
}

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export const columns: ColumnDef<TalentRequest>[] = [
  { accessorKey: "fullname", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "experienceLevel", header: "Experience Level" },
  { accessorKey: "jobRole", header: "Job Role" },
  {
    accessorKey: "jobDescription",
    header: "Job Description",
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-[420px]">
        {row.original.jobDescription ?? "—"}
      </span>
    )
  },
  { accessorKey: "company", header: "Company" },
  {
    accessorKey: "companyLink",
    header: "Company Link",
    cell: ({ row }) =>
      row.original.companyLink ? (
        <a
          className="text-pink-600 hover:underline"
          href={row.original.companyLink}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Open
        </a>
      ) : (
        "—"
      )
  },
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
        {fmtDate(row.original.updatedAt)}
      </span>
    )
  }
];
