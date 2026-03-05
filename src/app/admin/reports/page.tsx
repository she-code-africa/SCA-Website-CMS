// src/app/admin/reports/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getReports } from "@/features/reports/api";
import type { Report, ReportFilters } from "@/features/reports/types";

import { ReportFilters as Filters } from "@/features/reports/components/report-filters";
import { ReportTable } from "@/features/reports/components/report-table";
import { MobileReportCard } from "@/features/reports/components/mobile-report-card";
import { MobileReportSkeletonCard } from "@/features/reports/components/mobile-report-skeleton-card";
import { ReportSheet } from "@/features/reports/components/report-sheet";
import { ReportPagination } from "@/features/reports/components/report-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

/** * FORCE DYNAMIC: This prevents Next.js from trying to "prerender"
 * the page during build time, which is where your error is occurring.
 */
export const dynamic = "force-dynamic";

// local filter/sort util
function applyClientFilters(rows: Report[], f: ReportFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((r) => {
      return (
        r.year?.toLowerCase().includes(q) || r.link?.toLowerCase().includes(q)
      );
    });
  }

  if (f.year && f.year !== "") out = out.filter((r) => r.year === f.year);

  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Report, b: Report) => {
      const av = a?.[key];
      const bv = b?.[key];

      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }

      if (key === "year") {
        return Number(bv ?? 0) - Number(av ?? 0);
      }

      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    out.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
  }

  return out;
}

export default function ReportsPage() {
  const [filters, setFilters] = React.useState<ReportFilters>({
    search: "",
    year: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Report | null>(null);

  /**
   * HYDRATION SAFE EFFECT: We check if window exists before adding listeners.
   */
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("report:add", handler);
    return () => window.removeEventListener("report:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.year, filters.sortBy]);

  const query = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Report[], filters),
    [query.data, filters]
  );

  const yearOptions = React.useMemo(() => {
    if (!query.data) return [];
    const years = [...new Set(query.data.map((r) => r.year))].sort(
      (a, b) => Number(b) - Number(a)
    );
    return years.filter(Boolean);
  }, [query.data]);

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (r: Report) => {
    setSelected(r);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Reports"
      description="Manage annual and operational reports published on the website."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} report(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({
                search: "",
                year: "",
                sortBy: ""
              })
            }
            yearOptions={yearOptions}
          />

          <ReportPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 md:hidden">
            {query.isLoading ? (
              // UNIQUE KEYS: Added specific prefix to avoid hydration warnings
              Array.from({ length: 6 }).map((_, i) => (
                <MobileReportSkeletonCard key={`report-skeleton-${i}`} />
              ))
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load reports.
              </div>
            ) : paged.length ? (
              paged.map((r) => (
                <button
                  key={r._id}
                  type="button"
                  onClick={() => openView(r)}
                  className="text-left w-full"
                >
                  <MobileReportCard report={r} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No reports found.
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <TableFrame>
              <ReportTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openView}
              />
            </TableFrame>
          </div>
        </div>

        <ReportSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          reportId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
