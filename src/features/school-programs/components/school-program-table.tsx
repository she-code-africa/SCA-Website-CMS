// src/features/school-programs/components/school-program-table.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import type { SchoolProgram } from "@/features/school-programs/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MobileSchoolProgramCard } from "./mobile-school-program-card";
import { MobileSchoolProgramSkeletonCard } from "./mobile-school-program-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function schoolName(program: SchoolProgram) {
  return typeof program.school === "string"
    ? program.school
    : (program.school?.name ?? "—");
}

export function SchoolProgramTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: SchoolProgram[];
  isLoading: boolean;
  isError: boolean;
  onView: (program: SchoolProgram) => void;
  onEdit: (program: SchoolProgram) => void;
}) {
  const headers = [
    "Title",
    "Cohort",
    "School",
    "State",
    "Published",
    "Updated",
    "Created",
    "Action"
  ];

  const handleRowClick = (program: SchoolProgram) => {
    onView(program);
  };

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileSchoolProgramSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load school programs.
          </div>
        ) : rows.length ? (
          rows.map((program) => (
            <button
              key={program._id}
              type="button"
              onClick={() => onView(program)}
              className="text-left w-full"
            >
              <MobileSchoolProgramCard program={program} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            No school programs found.
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
                      Failed to load school programs.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((program) => (
                    <TableRow
                      key={program._id}
                      onClick={() => handleRowClick(program)}
                      className={cn("cursor-pointer hover:bg-muted/50")}
                    >
                      {/* Title with image */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {program.image ? (
                            <img
                              src={program.image}
                              alt={program.title}
                              className="h-8 w-8 rounded object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium">
                            {program.title ?? "—"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {program.cohort ?? "—"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {schoolName(program)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {program.state ? (
                          <Badge
                            variant={
                              program.state === "published"
                                ? "default"
                                : "outline"
                            }
                          >
                            {program.state}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(program.publishDate)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(program.updatedAt)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(program.createdAt)}
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
                            onClick={() => onView(program)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(program)}
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
                      No school programs found.
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
