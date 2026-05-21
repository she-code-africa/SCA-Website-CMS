"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCourses } from "@/features/courses/api";
import type { Course, CoursesFilters } from "@/features/courses/types";
import { CourseFilters } from "@/features/courses/components/course-filters";
import { CourseTable } from "@/features/courses/components/course-table";
import { CourseSheet } from "@/features/courses/components/course-sheet";
import { CoursePagination } from "@/features/courses/components/course-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function CoursesPage() {
  const [filters, setFilters] = React.useState<CoursesFilters>({
    search: "",
    school: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Course | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("course:add", handler);
    return () => window.removeEventListener("course:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.school]);

  const query = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => getCourses(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (course: Course) => {
    setSelected(course);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setSelected(course);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_COURSE}>
      <TableShell
        title="Courses"
        description="Manage courses and applications."
        right={
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {query.isLoading ? "Loading…" : `${rows.length} course(s)`}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CourseFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: "", school: "" })}
            />
            <CoursePagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="space-y-3">
            <div className="md:hidden">
              <CourseTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onView={openView}
                onEdit={openEdit}
              />
            </div>
            <div className="hidden md:block">
              <TableFrame>
                <CourseTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onView={openView}
                  onEdit={openEdit}
                />
              </TableFrame>
            </div>
          </div>

          <CourseSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            courseId={selected?._id}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
