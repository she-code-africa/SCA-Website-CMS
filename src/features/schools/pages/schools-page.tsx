"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSchools } from "@/features/schools/api";
import type { School, SchoolsFilters } from "@/features/schools/types";
import { SchoolFilters } from "@/features/schools/components/school-filters";
import { SchoolTable } from "@/features/schools/components/school-table";
import { SchoolSheet } from "@/features/schools/components/school-sheet";
import { SchoolPagination } from "@/features/schools/components/school-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function SchoolsPage() {
  const [filters, setFilters] = React.useState<SchoolsFilters>({
    search: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<School | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleSheetUpdate = async () => {
    setIsUpdating(true);
    try {
      await query.refetch();
    } finally {
      setIsUpdating(false);
    }
  };

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("school:add", handler);
    return () => window.removeEventListener("school:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search]);

  const query = useQuery({
    queryKey: ["schools", filters],
    queryFn: () => getSchools(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (school: School) => {
    setSelected(school);
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (school: School) => {
    setSelected(school);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_SCHOOL}>
      <TableShell
        title="Schools"
        description="Manage schools in the system."
        right={
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {query.isLoading ? "Loading…" : `${rows.length} school(s)`}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SchoolFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: "" })}
            />
            <SchoolPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="space-y-3">
            <div className="md:hidden">
              <SchoolTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onView={openView}
                onEdit={openEdit}
              />
            </div>
            <div className="hidden md:block">
              <TableFrame>
                <SchoolTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isUpdating={isUpdating}
                  isError={query.isError}
                  onView={openView}
                  onEdit={openEdit}
                />
              </TableFrame>
            </div>
          </div>

          <SchoolSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            schoolId={selected?._id}
            onUpdate={handleSheetUpdate}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
