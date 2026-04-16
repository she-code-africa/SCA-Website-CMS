// src/features/stem-a-girl/courses/components/mobile-course-card.tsx

"use client";

import type { Course } from "../types";
import { Badge } from "@/components/ui/badge";
import { fmtDate, getInitials, getActivityName } from "../utils";

export function MobileCourseCard({
  course,
  activityMap
}: {
  course: Course;
  activityMap: Map<string, string>;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {course.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt={course.title}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {getInitials(course.title)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {course.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {getActivityName(course, activityMap)} •{" "}
            {course.link ? "Has link" : "No link"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge
              variant={course.state === "published" ? "default" : "secondary"}
            >
              {course.state ?? "draft"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(course.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(course.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
