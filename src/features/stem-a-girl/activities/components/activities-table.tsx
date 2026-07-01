"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import type { SAGActivity } from "../types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
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

export function ActivitiesTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: SAGActivity[];
  isLoading: boolean;
  isError: boolean;
  onView: (a: SAGActivity) => void;
  onEdit: (a: SAGActivity) => void;
}) {
  const headers = ["Title", "Description", "Updated", "Created", "Action"];

  const handleRowClick = (activity: SAGActivity) => {
    onView(activity);
  };

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
                  Failed to load activities.
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((a) => (
                <TableRow
                  key={a._id}
                  onClick={() => handleRowClick(a)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {a.image ? (
                        <img
                          src={a.image}
                          alt={a.title}
                          className="h-8 w-8 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted border" />
                      )}
                      <span className="font-medium">{a.title ?? "—"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[520px]">
                    <span className="text-muted-foreground line-clamp-1">
                      {a.description ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(a.updatedAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(a.createdAt)}
                  </TableCell>

                  <TableCell
                    className="whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onView(a)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(a)}
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
                  No activities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
