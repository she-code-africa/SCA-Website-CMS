// src/features/testimonials/components/testimonial-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import type {
  Testimonial,
  TestimonialState
} from "@/features/testimonials/types";
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

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateBadgeVariant(state?: TestimonialState) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary"; // draft
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function TestimonialTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: Testimonial[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (t: Testimonial) => void;
}) {
  const headers = [
    "Name",
    "Role",
    "Testimonial",
    "State",
    "Updated",
    "Created"
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
              Failed to load testimonials.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((t) => (
            <TableRow
              key={t._id}
              onClick={() => onRowClick(t)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {initials(t.name)}
                    </div>
                  )}
                  <span className="font-medium">{t.name ?? "—"}</span>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {t.role ?? "—"}
              </TableCell>

              <TableCell className="max-w-xs truncate">
                {t.testimonial ?? "—"}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <Badge variant={stateBadgeVariant(t.state)}>
                  {t.state ?? "draft"}
                </Badge>
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(t.updatedAt)}
              </TableCell>

              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(t.createdAt)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No testimonials found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
