// src/features/stem-a-girl/courses/components/courses-table.tsx

"use client";

import * as React from "react";
import { Eye, Pencil } from "lucide-react";
import type { Course } from "../types";
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
import { fmtDate, getInitials, getActivityName } from "../utils";

function stateBadge(state?: string) {
  if (state === "published")
    return <Badge className="bg-green-600">Published</Badge>;
  if (state === "archived")
    return <Badge variant="destructive">Archived</Badge>;
  return <Badge variant="secondary">Draft</Badge>;
}

export function CoursesTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit,
  activityMap
}: {
  rows: Course[];
  isLoading: boolean;
  isError: boolean;
  onView: (c: Course) => void;
  onEdit: (c: Course) => void;
  activityMap: Map<string, string>;
}) {
  const headers = [
    "Course",
    "Description",
    "Difficulty",
    "Est. Hours",
    "Activity",
    "Featured",
    "State",
    "Updated",
    "Action"
  ];

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
                    <TableCell key={cIdx}>
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
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((course) => (
                <TableRow
                  key={course._id}
                  onClick={() => onView(course)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  {/* Course column (image + title) */}
                  <TableCell className="whitespace-normal min-w-50">
                    <div className="flex items-center gap-2">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-8 w-8 rounded-full object-cover border shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                          {getInitials(course.title)}
                        </div>
                      )}
                      <span className="font-medium wrap-break-word">
                        {course.title}
                      </span>
                    </div>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="max-w-md truncate">
                    {course.description}
                  </TableCell>

                  {/* Difficulty */}
                  <TableCell className="whitespace-nowrap">
                    {course.difficulty || "—"}
                  </TableCell>

                  {/* Est. Hours */}
                  <TableCell className="whitespace-nowrap">
                    {course.estimatedHours || "—"}
                  </TableCell>

                  {/* Activity */}
                  <TableCell className="whitespace-nowrap">
                    {getActivityName(course, activityMap)}
                  </TableCell>

                  {/* Featured */}
                  <TableCell className="whitespace-nowrap">
                    {course.featured ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* State */}
                  <TableCell className="whitespace-nowrap">
                    {stateBadge(course.state)}
                  </TableCell>

                  {/* Updated */}
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(course.updatedAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    className="whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-1">
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
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
