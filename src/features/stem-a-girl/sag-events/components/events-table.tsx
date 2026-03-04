"use client";

import * as React from "react";
import { format } from "date-fns";
import type { SagEvent } from "@/features/stem-a-girl/sag-events/types";import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MobileEventCard } from "./mobile-event-card";
import { MobileEventSkeletonCard } from "./mobile-event-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function activityTitle(e: SagEvent) {
  return typeof e.activity === "string"
    ? e.activity
    : (e.activity?.title ?? "—");
}

export function EventsTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: SagEvent[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (e: SagEvent) => void;
}) {
  const headers = [
    "Title",
    "Activity",
    "State",
    "Event Date",
    "Updated",
    "Created"
  ];

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileEventSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load events.
          </div>
        ) : rows.length ? (
          rows.map((e) => (
            <button
              key={e._id}
              type="button"
              onClick={() => onRowClick(e)}
              className="text-left w-full"
            >
              <MobileEventCard event={e} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            No events found.
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
                  rows.map((e) => (
                    <TableRow
                      key={e._id}
                      onClick={() => onRowClick(e)}
                      className={cn("cursor-pointer hover:bg-muted/50")}
                    >
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {e.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={e.image}
                              alt={e.title}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted" />
                          )}
                          <span className="font-medium">{e.title ?? "—"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {activityTitle(e)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {e.state ?? "—"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(e.eventDate)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(e.updatedAt)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(e.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={headers.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No events found.
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
