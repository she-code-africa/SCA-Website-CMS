// src/features/stem-a-girl/outreach/components/outreach-table.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Pencil, ExternalLink } from "lucide-react";
import type { Outreach } from "../types";
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

export function OutreachTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: Outreach[];
  isLoading: boolean;
  isError: boolean;
  onView: (o: Outreach) => void;
  onEdit: (o: Outreach) => void;
}) {
  const headers = [
    "Image",
    "State",
    "Description",
    "Outreach Date",
    "Gallery Link",
    "Total Images",
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
                  Failed to load outreach.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No outreach records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((outreach) => (
                <TableRow
                  key={outreach._id}
                  onClick={() => onView(outreach)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-nowrap">
                    {outreach.coverImage ? (
                      <img
                        src={outreach.coverImage}
                        alt={outreach.state}
                        className="h-8 w-8 rounded object-cover border shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-semibold">
                        📸
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {outreach.state}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {outreach.description}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {fmtDate(outreach.outreachDate)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {outreach.galleryLink ? (
                      <a
                        href={outreach.galleryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {outreach.totalImages ?? 0}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(outreach.updatedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(outreach.createdAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(outreach)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(outreach)}
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
