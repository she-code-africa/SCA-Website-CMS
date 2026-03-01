"use client";

import * as React from "react";
import { format } from "date-fns";
import type { SchoolProgram } from "@/features/school-programs/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  onRowClick
}: {
  rows: SchoolProgram[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (program: SchoolProgram) => void;
}) {
  const headers = [
    "Title",
    "Cohort",
    "School",
    "State",
    "Published",
    "Updated",
    "Created"
  ];

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
              onClick={() => onRowClick(program)}
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
                  rows.map((program) => {
                    return (
                      <TableRow
                        key={program._id}
                        onClick={() => onRowClick(program)}
                        className={cn("cursor-pointer hover:bg-muted/50")}
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {program.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
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
                      </TableRow>
                    );
                  })
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