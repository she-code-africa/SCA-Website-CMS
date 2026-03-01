// src/features/enquiries/components/enquiry-table.tsx
"use client";

import * as React from "react";
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
import type { Enquiry } from "../types";
import { format } from "date-fns";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function statusVariant(status?: string) {
  if (status === "closed") return "secondary";
  return "default"; // open
}

export function EnquiryTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: Enquiry[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (r: Enquiry) => void;
}) {
  const headers = ["Full Name", "Email", "Message", "Status", "Updated"];

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
              Failed to load enquiries.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((e) => (
            <TableRow
              key={e._id}
              onClick={() => onRowClick(e)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              <TableCell className="whitespace-nowrap">
                <span className="font-medium">{e.fullName ?? "—"}</span>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {e.email ?? "—"}
              </TableCell>

              <TableCell className="max-w-105">
                <p
                  className="text-sm text-muted-foreground line-clamp-2"
                  title={e.description}
                >
                  {e.description || "—"}
                </p>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <Badge variant={statusVariant(e.status)}>
                  {e.status ?? "open"}
                </Badge>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(e.updatedAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No enquiries found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
