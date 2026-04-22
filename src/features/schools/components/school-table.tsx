// src/features/schools/components/school-table.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import type { School } from "@/features/schools/types";
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
import { MobileSchoolCard } from "./mobile-school-card";
import { MobileSchoolSkeletonCard } from "./mobile-school-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function SchoolTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: School[];
  isLoading: boolean;
  isError: boolean;
  onView: (school: School) => void;
  onEdit: (school: School) => void;
}) {
  const headers = ["Name", "Description", "Updated", "Created", "Action"];

  const handleRowClick = (school: School) => {
    onView(school);
  };

  return (
    <div className="space-y-3">
      {/* Mobile list – no action column */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileSchoolSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load schools.
          </div>
        ) : rows.length ? (
          rows.map((school) => (
            <button
              key={school._id}
              type="button"
              onClick={() => onView(school)}
              className="text-left w-full"
            >
              <MobileSchoolCard school={school} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            No schools found.
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
                      Failed to load schools.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((school) => (
                    <TableRow
                      key={school._id}
                      onClick={() => handleRowClick(school)}
                      className={cn("cursor-pointer hover:bg-muted/50")}
                    >
                      <TableCell className="whitespace-nowrap font-medium">
                        {school.name ?? "—"}
                      </TableCell>

                      <TableCell className="max-w-md truncate">
                        {school.description ?? "—"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(school.updatedAt)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(school.createdAt)}
                      </TableCell>

                      {/* Action column */}
                      <TableCell
                        className="whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onView(school)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(school)}
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
                      No schools found.
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
