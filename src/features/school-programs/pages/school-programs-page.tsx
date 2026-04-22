"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSchoolPrograms } from "@/features/school-programs/api";
import type {
  SchoolProgram,
  SchoolProgramsFilters
} from "@/features/school-programs/types";
import { SchoolProgramFilters } from "@/features/school-programs/components/school-program-filters";
import { SchoolProgramTable } from "@/features/school-programs/components/school-program-table";
import { SchoolProgramSheet } from "@/features/school-programs/components/school-program-sheet";
import { SchoolProgramPagination } from "@/features/school-programs/components/school-program-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function SchoolProgramsPage() {
  const [filters, setFilters] = React.useState<SchoolProgramsFilters>({
    search: "",
    state: "",
    school: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<SchoolProgram | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("school-program:add", handler);
    return () => window.removeEventListener("school-program:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.school]);

  const query = useQuery({
    queryKey: ["school-programs", filters],
    queryFn: () => getSchoolPrograms(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (program: SchoolProgram) => {
    setSelected(program);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (program: SchoolProgram) => {
    setSelected(program);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_SCHOOLPROGRAM}>
      <TableShell
        title="School Programs"
        description="Manage school programs and cohorts."
        right={
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {query.isLoading ? "Loading…" : `${rows.length} program(s)`}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SchoolProgramFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: "", state: "", school: "" })}
            />
            <SchoolProgramPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="space-y-3">
            <div className="md:hidden">
              <SchoolProgramTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onView={openView}
                onEdit={openEdit}
              />
            </div>
            <div className="hidden md:block">
              <TableFrame>
                <SchoolProgramTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onView={openView}
                  onEdit={openEdit}
                />
              </TableFrame>
            </div>
          </div>

          <SchoolProgramSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            programId={selected?._id}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
