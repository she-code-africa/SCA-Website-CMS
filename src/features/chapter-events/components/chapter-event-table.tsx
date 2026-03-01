// src/features/chapters/components/chapter-event-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import type { ChapterEvent } from "@/features/chapters/types";
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

import { MobileChapterEventCard } from "./mobile-chapter-event-card";
import { MobileChapterEventSkeletonCard } from "./mobile-chapter-event-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateBadgeVariant(state?: string) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary";
}

export function ChapterEventTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: ChapterEvent[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (event: ChapterEvent) => void;
}) {
  const headers = ["Name", "Status", "Event Date", "Created"];

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileChapterEventSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load events.
          </div>
        ) : rows.length ? (
          rows.map((ev) => (
            <button
              key={ev._id}
              type="button"
              onClick={() => onRowClick(ev)}
              className="text-left w-full"
            >
              <MobileChapterEventCard event={ev} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            There are no events for this chapter.
          </div>
        )}
      </div>

      {/* Tablet + Desktop table */}
      <div className="hidden md:block">
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
                      Failed to load events.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((ev) => (
                    <TableRow
                      key={ev._id}
                      onClick={() => onRowClick(ev)}
                      className={cn("cursor-pointer hover:bg-muted/50")}
                    >
                      <TableCell className="whitespace-nowrap">
                        <span className="font-medium">{ev.title ?? "—"}</span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Badge variant={stateBadgeVariant(ev.eventState)}>
                          {ev.eventState ?? "draft"}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(ev.eventDate)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(ev.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={headers.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      There are no events for this chapter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
