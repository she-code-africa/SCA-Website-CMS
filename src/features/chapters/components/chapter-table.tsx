// src/features/chapters/components/chapter-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Users } from "lucide-react";
import type { Chapter } from "@/features/chapters/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

function stateBadgeVariant(state?: string) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary"; // draft
}

function getCategoryName(category: any): string {
  if (!category) return "—";
  if (typeof category === "string") return category;
  return category.name ?? "—";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ChapterTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: Chapter[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (c: Chapter) => void;
}) {
  const headers = [
    "Name",
    "Location",
    "Category",
    "Leader",
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
              Failed to load chapters.
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
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.image || undefined} alt={c.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{c.name ?? "—"}</span>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {c.city}, {c.country}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {getCategoryName(c.category)}
              </TableCell>

              <TableCell className="max-w-xs truncate">
                {c.leader ?? "—"}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <Badge variant={stateBadgeVariant(c.state)}>
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
              No chapters found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
