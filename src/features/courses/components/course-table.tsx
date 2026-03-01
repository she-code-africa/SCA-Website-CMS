"use client";

import * as React from "react";
import { format } from "date-fns";
import type { Course } from "@/features/courses/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MobileCourseCard } from "./mobile-course-card";
import { MobileCourseSkeletonCard } from "./mobile-course-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function schoolName(course: Course) {
  return typeof course.school === "string"
    ? course.school
    : (course.school?.name ?? "—");
}

export function CourseTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: Course[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (course: Course) => void;
}) {
  const headers = ["Course Name", "Description", "School", "Updated", "Created"];

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileCourseSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load courses.
          </div>
        ) : rows.length ? (
          rows.map((course) => (
            <button
              key={course._id}
              type="button"
              onClick={() => onRowClick(course)}
              className="text-left w-full"
            >
              <MobileCourseCard course={course} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            No courses found.
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
                      Failed to load courses.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((course) => {
                    return (
                      <TableRow
                        key={course._id}
                        onClick={() => onRowClick(course)}
                        className={cn("cursor-pointer hover:bg-muted/50")}
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {course.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={course.image}
                                alt={course.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium">
                              {course.name ?? "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-md">
                          <div className="truncate">
                            {course.shortDescription ?? "—"}
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {schoolName(course)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {fmtDate(course.updatedAt)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {fmtDate(course.createdAt)}
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
                      No courses found.
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