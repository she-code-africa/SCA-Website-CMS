"use client";

import * as React from "react";
import { format } from "date-fns";
import { ExternalLink, Eye } from "lucide-react";
import type { Report } from "@/features/reports/types";
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
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function ReportTable({
  rows,
  isLoading,
  isError,
  onView
}: {
  rows: Report[];
  isLoading: boolean;
  isError: boolean;
  onView: (r: Report) => void;
}) {
  const headers = ["Year", "Link", "Updated", "Created", "Action"];

  const handleRowClick = (report: Report) => {
    onView(report);
  };

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
              Failed to load reports.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((r) => (
            <TableRow
              key={r._id}
              onClick={() => handleRowClick(r)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              {/* Year column */}
              <TableCell className="whitespace-nowrap">
                <Badge variant="outline" className="font-semibold">
                  {r.year ?? "—"}
                </Badge>
              </TableCell>

              {/* Link column */}
              <TableCell className="max-w-md">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">{r.link ?? "—"}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              </TableCell>

              {/* Updated column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(r.updatedAt)}
              </TableCell>

              {/* Created column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(r.createdAt)}
              </TableCell>

              {/* Action column */}
              <TableCell
                className="whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onView(r)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No reports found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
