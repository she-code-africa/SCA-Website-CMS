// src/features/talent-requests/components/columns.tsx

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import type { TalentRequest, TalentRequestStatus } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function getColumns({
  onView,
  onApprove,
  onReject
}: {
  onView: (row: TalentRequest) => void;
  onApprove: (row: TalentRequest) => void;
  onReject: (row: TalentRequest) => void;
}): ColumnDef<TalentRequest>[] {
  return [
    { accessorKey: "company", header: "Company" },
    { accessorKey: "jobRole", header: "Role Name" },
    { accessorKey: "fullname", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
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
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {fmtDate(row.original.updatedAt)}
        </span>
      )
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const talent = row.original;
        const isPending = talent.status === "Pending";
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onView(talent);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove(talent);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject(talent);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];
}
