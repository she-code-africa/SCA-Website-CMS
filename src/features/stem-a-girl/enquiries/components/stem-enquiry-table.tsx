// src/features/stem-a-girl/enquiries/components/stem-enquiry-table.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import type { StemEnquiry } from "../types";
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

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function statusBadge(status?: string) {
  if (status === "closed")
    return <Badge className="bg-green-600">Closed</Badge>;
  return <Badge className="bg-red-600">Open</Badge>;
}

export function StemEnquiryTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: StemEnquiry[];
  isLoading: boolean;
  isError: boolean;
  onView: (e: StemEnquiry) => void;
  onEdit: (e: StemEnquiry) => void;
}) {
  const headers = [
    "Full Name",
    "Email",
    "Subject",
    "Description",
    "Status",
    "Updated",
    "Created",
    "Action"
  ];

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
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
                    <TableCell key={cIdx}>
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
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No enquiries found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((enquiry) => (
                <TableRow
                  key={enquiry._id}
                  onClick={() => onView(enquiry)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-nowrap">
                    {enquiry.fullName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {enquiry.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {enquiry.subject}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {enquiry.description}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {statusBadge(enquiry.status)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(enquiry.updatedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(enquiry.createdAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(enquiry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(enquiry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
