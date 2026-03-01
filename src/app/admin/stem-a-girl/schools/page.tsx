// src/app/(dashboard)/stem-a-girl/schools/page.tsx (or wherever)
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getSAGSchools } from "@/features/stem-a-girl/schools/api";
import type { SAGSchool, SAGSchoolsFilters } from "@/features/stem-a-girl/schools/types";

import { SchoolsFilters } from "@/features/stem-a-girl/schools/components/schools-filters";
import { SchoolsTable } from "@/features/stem-a-girl/schools/components/schools-table";
import { MobileSchoolCard } from "@/features/stem-a-girl/schools/components/mobile-school-card";
import { MobileSchoolSkeletonCard } from "@/features/stem-a-girl/schools/components/mobile-school-skeleton-card";
import { SchoolSheet } from "@/features/stem-a-girl/schools/components/school-sheet";

import { TeamPagination } from "@/features/team/components/team-pagination"; // reuse
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function SchoolsPage() {
  const [filters, setFilters] = React.useState<SAGSchoolsFilters>({ search: "" });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<SAGSchool | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setSheetMode("create");
      setSheetOpen(true);
    };
    window.addEventListener("sag-school:add", handler);
    return () => window.removeEventListener("sag-school:add", handler);
  }, []);

  React.useEffect(() => setPage(1), [filters.search]);

  const query = useQuery({
    queryKey: ["sag-schools", filters],
    queryFn: () => getSAGSchools(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (s: SAGSchool) => {
    setSelected(s);
    setSheetMode("view");
    setSheetOpen(true);
  };

  return (
    <TableShell
      title="Schools"
      description="Manage Stem-A-Girl schools."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} school(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SchoolsFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "" })}
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
          {/* Mobile list */}
          <div className="grid gap-3 md:hidden">
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <MobileSchoolSkeletonCard key={i} />)
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load schools.
              </div>
            ) : paged.length ? (
              paged.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => openView(s)}
                  className="text-left w-full"
                >
                  <MobileSchoolCard school={s} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No schools found.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <TableFrame>
              <SchoolsTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openView}
              />
            </TableFrame>
          </div>
        </div>

        <SchoolSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          schoolId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
