// src/features/stem-a-girl/schools/components/schools-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import type { SAGSchool } from "../types";
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

export function SchoolsTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: SAGSchool[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (s: SAGSchool) => void;
}) {
  const headers = ["Name", "Description", "Updated", "Created"];

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
                    <TableCell key={cIdx} className="whitespace-nowrap">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-24 text-center text-red-500">
                  Failed to load schools.
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((s) => (
                <TableRow
                  key={s._id}
                  onClick={() => onRowClick(s)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-8 w-8 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted border" />
                      )}
                      <span className="font-medium">{s.name ?? "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[520px]">
                    <span className="text-muted-foreground line-clamp-1">
                      {s.description ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(s.updatedAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(s.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-24 text-center text-muted-foreground">
                  No schools found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
