// src/features/stem-a-girl/courses/components/mobile-course-card.tsx
"use client";

import { format } from "date-fns";
import type { SAGCourse } from "../types";
import { Badge } from "@/components/ui/badge";
import { activityLabel } from "../utils";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(title?: string) {
  const parts = (title ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

export function MobileCourseCard({ course }: { course: SAGCourse }) {
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
            {initials(course.title)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {course.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activityLabel(course)} • {course.link ? "Has link" : "No link"}
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
