// src/app/(dashboard)/stem-a-girl/courses/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getSAGCourses } from "@/features/stem-a-girl/courses/api";
import type {
  SAGCourse,
  SAGCoursesFilters
} from "@/features/stem-a-girl/courses/types";

import { CoursesFilters } from "@/features/stem-a-girl/courses/components/courses-filters";
import { CoursesTable } from "@/features/stem-a-girl/courses/components/courses-table";
import { MobileCourseCard } from "@/features/stem-a-girl/courses/components/mobile-course-card";
import { MobileCourseSkeletonCard } from "@/features/stem-a-girl/courses/components/mobile-course-skeleton-card";
import { CourseSheet } from "@/features/stem-a-girl/courses/components/course-sheet";

import { TeamPagination } from "@/features/team/components/team-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function CoursesPage() {
  const [filters, setFilters] = React.useState<SAGCoursesFilters>({
    search: "",
    state: "",
    activity: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<SAGCourse | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setSheetMode("create");
      setSheetOpen(true);
    };
    window.addEventListener("sag-course:add", handler);
    return () => window.removeEventListener("sag-course:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.activity]);

  const query = useQuery({
    queryKey: ["sag-courses", filters],
    queryFn: () => getSAGCourses(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (c: SAGCourse) => {
    setSelected(c);
    setSheetMode("view");
    setSheetOpen(true);
  };

  return (
    <TableShell
      title="Courses"
      description="Manage Stem-A-Girl courses."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} course(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <CoursesFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", state: "", activity: "" })}
          />

          <TeamPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        <div className="space-y-3">
          {/* Mobile */}
          <div className="grid gap-3 md:hidden">
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <MobileCourseSkeletonCard key={i} />
              ))
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load courses.
              </div>
            ) : paged.length ? (
              paged.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => openView(c)}
                  className="text-left w-full"
                >
                  <MobileCourseCard course={c} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No courses found.
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <TableFrame>
              <CoursesTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openView}
              />
            </TableFrame>
          </div>
        </div>

        <CourseSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          courseId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
