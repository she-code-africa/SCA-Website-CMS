// src/features/our-reach/components/reach-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import type { Reach } from "@/features/our-reach/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function ReachTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: Reach[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (r: Reach) => void;
}) {
  const headers = ["Name", "Value", "Updated", "Created"];

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
              Failed to load our reach stats.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((r) => (
            <TableRow
              key={r._id}
              onClick={() => onRowClick(r)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{r.name ?? "—"}</span>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="text-lg font-semibold text-primary">
                  {formatNumber(r.value ?? 0)}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(r.updatedAt)}
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(r.createdAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No reach stats found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}