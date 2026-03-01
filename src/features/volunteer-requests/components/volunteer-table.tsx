// src/features/volunteers/components/volunteer-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import type {
  VolunteerRequest,
  VolunteerStatus
} from "@/features/volunteer-requests/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function statusBadgeVariant(status?: VolunteerStatus) {
  if (status === "Approved") return "default";
  if (status === "Rejected") return "destructive";
  return "secondary"; // Pending
}

export function VolunteerTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: VolunteerRequest[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (v: VolunteerRequest) => void;
}) {
  const headers = [
    "Full Name",
    "Email",
    "Current Role",
    "Volunteer Role",
    "Status",
    "Updated"
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableHead key={h} className="whitespace-nowrap">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <TableRow key={idx}>
              {headers.map((_, cIdx) => (
                <TableCell key={cIdx} className="whitespace-nowrap">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : isError ? (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-red-500"
            >
              Failed to load volunteer requests.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((v) => (
            <TableRow
              key={v._id}
              onClick={() => onRowClick(v)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              <TableCell className="whitespace-nowrap">
                <span className="font-medium">{v.fullname ?? "—"}</span>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {v.email ?? "—"}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {v.currentRole ?? "—"}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {v.volunteerRole ?? "—"}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <Badge variant={statusBadgeVariant(v.status)}>
                  {v.status ?? "Pending"}
                </Badge>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(v.updatedAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No volunteer requests found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
