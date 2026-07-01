// app/admin/school-programs/page.tsx

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

/* ============================
  Helper: extract school name
============================ */
function getSchoolName(program: SchoolProgram): string {
  if (typeof program.school === "string") return program.school;
  return program.school?.name ?? "";
}

/* ============================
  Client‑side filtering
============================ */
function applyFilters(
  data: SchoolProgram[],
  filters: SchoolProgramsFilters
): SchoolProgram[] {
  let filtered = [...data];

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title?.toLowerCase().includes(search) ||
        String(p.cohort ?? "")
          .toLowerCase()
          .includes(search) ||
        getSchoolName(p).toLowerCase().includes(search)
    );
  }

  if (filters.state) {
    filtered = filtered.filter((p) => p.state === filters.state);
  }

  if (filters.school) {
    filtered = filtered.filter((p) => {
      const id =
        typeof p.school === "string" ? p.school : (p.school?._id ?? "");
      return id === filters.school;
    });
  }

  return filtered;
}

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

  // Reset page when any filter changes
  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.school]);

  const query = useQuery({
    queryKey: ["school-programs"], // no filters in key – fetch all
    queryFn: () => getSchoolPrograms(), // no filter arguments (or pass empty)
    staleTime: 30_000
  });

  // Apply client‑side filters after fetching
  const filtered = React.useMemo(
    () => applyFilters(query.data ?? [], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

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
              {query.isLoading ? "Loading…" : `${filtered.length} program(s)`}
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
