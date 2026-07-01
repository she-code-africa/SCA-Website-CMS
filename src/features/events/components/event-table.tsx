// src/features/events/components/event-table.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar, ExternalLink, Eye, Pencil } from "lucide-react";
import type { Event, EventState } from "@/features/events/types";
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

function stateBadgeVariant(state?: EventState) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary"; // draft
}

type Props = {
  rows: Event[];
  isLoading: boolean;
  isUpdating?: boolean; // <-- NEW
  isError: boolean;
  onView: (e: Event) => void;
  onEdit: (e: Event) => void;
};

export function EventTable({
  rows,
  isLoading,
  isUpdating = false,
  isError,
  onView,
  onEdit
}: Props) {
  const headers = ["Title", "Link", "State", "Event Date", "Created", "Action"];

  const showSkeleton = isLoading || isUpdating;

  const handleRowClick = (e: Event) => {
    onView(e);
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
        {showSkeleton ? (
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
              onClick={() => handleRowClick(e)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              {/* Title column */}
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {e.image ? (
                    <img
                      src={e.image}
                      alt={e.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-medium">{e.title ?? "—"}</span>
                </div>
              </TableCell>

              {/* Link column */}
              <TableCell className="max-w-md">
                {e.link ? (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <span className="truncate">Link</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>

              {/* State column */}
              <TableCell className="whitespace-nowrap">
                <Badge variant={stateBadgeVariant(e.state)}>
                  {e.state ?? "draft"}
                </Badge>
              </TableCell>

              {/* Event Date column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(e.eventDate)}
              </TableCell>

              {/* Created column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(e.createdAt)}
              </TableCell>

              {/* Action column */}
              <TableCell
                className="whitespace-nowrap"
                onClick={(ev) => ev.stopPropagation()}
              >
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(e)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(e)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
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
  );
}
