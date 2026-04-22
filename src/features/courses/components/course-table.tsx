// src/features/courses/components/course-table.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Pencil } from "lucide-react";
import type { Course } from "@/features/courses/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onView,
  onEdit
}: {
  rows: Course[];
  isLoading: boolean;
  isError: boolean;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
}) {
  const headers = [
    "Course Name",
    "Description",
    "School",
    "Updated",
    "Created",
    "Action"
  ];

  const handleRowClick = (course: Course) => {
    onView(course);
  };

  return (
    <div className="space-y-3">
      {/* Mobile list – no action column needed */}
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
              onClick={() => onView(course)}
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
                  rows.map((course) => (
                    <TableRow
                      key={course._id}
                      onClick={() => handleRowClick(course)}
                      className={cn("cursor-pointer hover:bg-muted/50")}
                    >
                      {/* Course Name column – allows wrapping */}
                      <TableCell className="whitespace-normal min-w-50 wrap-break-word">
                        <div className="flex items-center gap-2">
                          {course.image ? (
                            <img
                              src={course.image}
                              alt={course.name}
                              className="h-8 w-8 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                              <GraduationCap className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium wrap-break-word">
                            {course.name ?? "—"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Description column – truncates */}
                      <TableCell className="max-w-md truncate">
                        {course.shortDescription ?? "—"}
                      </TableCell>

                      {/* School column */}
                      <TableCell className="whitespace-nowrap">
                        {schoolName(course)}
                      </TableCell>

                      {/* Updated column */}
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(course.updatedAt)}
                      </TableCell>

                      {/* Created column */}
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {fmtDate(course.createdAt)}
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
                            onClick={() => onView(course)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(course)}
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
