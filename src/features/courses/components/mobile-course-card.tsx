import { format } from "date-fns";
import type { Course } from "@/features/courses/types";
import { GraduationCap } from "lucide-react";

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

export function MobileCourseCard({ course }: { course: Course }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {course.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt={course.name}
            className="h-16 w-16 rounded-lg object-cover border shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {course.name ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {schoolName(course)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {course.shortDescription ?? "No description"}
          </p>
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