// src/features/stem-a-girl/courses/components/courses-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import type { SAGCourse } from "../types";
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
import { activityLabel } from "../utils";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function CoursesTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: SAGCourse[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (c: SAGCourse) => void;
}) {
  const headers = [
    "Title",
    "Description",
    "Link",
    "Activity",
    "State",
    "Updated",
    "Created"
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
                  Failed to load courses.
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((c) => (
                <TableRow
                  key={c._id}
                  onClick={() => onRowClick(c)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.image}
                          alt={c.title}
                          className="h-8 w-8 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted border" />
                      )}
                      <span className="font-medium">{c.title ?? "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[420px]">
                    <span className="text-muted-foreground line-clamp-1">
                      {c.description ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-[280px]">
                    {c.link ? (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-4 line-clamp-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.link}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {activityLabel(c)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant={
                        c.state === "published" ? "default" : "secondary"
                      }
                    >
                      {c.state ?? "draft"}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(c.updatedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(c.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
