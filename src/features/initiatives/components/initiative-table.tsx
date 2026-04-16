"use client";

import * as React from "react";
import { format } from "date-fns";
import { Lightbulb, ExternalLink, Eye } from "lucide-react";
import type { Initiative } from "@/features/initiatives/types";
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

function stripHtml(html: string) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function InitiativeTable({
  rows,
  isLoading,
  isError,
  onView
}: {
  rows: Initiative[];
  isLoading: boolean;
  isError: boolean;
  onView: (i: Initiative) => void;
}) {
  const headers = [
    "Name",
    "Description",
    "Link",
    "Available",
    "Created",
    "Action"
  ];

  const handleRowClick = (initiative: Initiative) => {
    onView(initiative);
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
              Failed to load initiatives.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((i) => (
            <TableRow
              key={i._id}
              onClick={() => handleRowClick(i)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              {/* Name column */}
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={i.image}
                      alt={i.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-medium">{i.title ?? "—"}</span>
                </div>
              </TableCell>

              {/* Description column */}
              <TableCell className="max-w-xs truncate">
                {stripHtml(i.description ?? "—")}
              </TableCell>

              {/* Link column */}
              <TableCell className="max-w-md">
                {i.initiative_url ? (
                  <a
                    href={i.initiative_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">Link</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>

              {/* Available column */}
              <TableCell className="whitespace-nowrap">
                <Badge variant={i.isAvailable ? "default" : "secondary"}>
                  {i.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </TableCell>

              {/* Created column */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(i.createdAt)}
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
                  onClick={() => onView(i)}
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
              No initiatives found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
