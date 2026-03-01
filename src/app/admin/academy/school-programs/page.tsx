"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

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

  // client-side pagination
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

  // reset to page 1 when filters change
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

  return (
    <TableShell
      title="School Programs"
      description="Manage school programs and cohorts."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} program(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SchoolProgramFilters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({ search: "", state: "", school: "" })
            }
          />

          <SchoolProgramPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        {/* Responsive table wrapper */}
        <div className="space-y-3">
          {/* Mobile list */}
          <div className="md:hidden">
            <SchoolProgramTable
              rows={paged}
              isLoading={query.isLoading}
              isError={query.isError}
              onRowClick={openView}
            />
          </div>

          {/* Tablet + Desktop table */}
          <div className="hidden md:block">
            <TableFrame>
              <SchoolProgramTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openView}
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
  );
}