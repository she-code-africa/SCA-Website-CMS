// src/features/enquiries/components/enquiry-table.tsx

"use client";

import * as React from "react";
import { Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function statusBadge(status?: string) {
  const isClosed = status === "closed";
  return (
    <Badge
      className={cn(
        isClosed
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : "bg-red-100 text-red-800 hover:bg-red-100"
      )}
    >
      {status ?? "open"}
    </Badge>
  );
}

export function EnquiryTable({
  rows,
  isLoading,
  isError,
  onRowClick,
  onMarkClosed
}: {
  rows: Enquiry[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (r: Enquiry) => void;
  onMarkClosed: (r: Enquiry) => void;
}) {
  const headers = [
    "Full Name",
    "Email",
    "Message",
    "Status",
    "Updated",
    "Action"
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
              Failed to load enquiries.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((enquiry) => (
            <TableRow
              key={enquiry._id}
              onClick={() => onRowClick(enquiry)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              <TableCell className="whitespace-nowrap">
                <span className="font-medium">{enquiry.fullName ?? "—"}</span>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {enquiry.email ?? "—"}
              </TableCell>

              <TableCell className="max-w-105">
                <p
                  className="text-sm text-muted-foreground line-clamp-2"
                  title={enquiry.description}
                >
                  {enquiry.description || "—"}
                </p>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {statusBadge(enquiry.status)}
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(enquiry.updatedAt)}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onRowClick(enquiry);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {enquiry.status !== "closed" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onMarkClosed(enquiry);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
