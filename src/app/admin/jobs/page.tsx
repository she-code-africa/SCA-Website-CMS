// src/app/admin/jobs/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getJobs } from "@/features/jobs/api";
import type { Job, JobFilters } from "@/features/jobs/types";

import { JobFilters as Filters } from "@/features/jobs/components/job-filters";
import { JobTable } from "@/features/jobs/components/job-table";
import { MobileJobCard } from "@/features/jobs/components/mobile-job-card";
import { MobileJobSkeletonCard } from "@/features/jobs/components/mobile-job-skeleton-card";
import { JobSheet } from "@/features/jobs/components/job-sheet";
import { JobPagination } from "@/features/jobs/components/job-pagination";
import { JobCategoriesPanel } from "@/features/jobs/components/job-categories-panel";
import { JobTypesPanel } from "@/features/jobs/components/job-types-panel";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function extractId(val: string | { _id: string } | null | undefined): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val._id || "";
}

function applyClientFilters(rows: Job[], f: JobFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((j) => {
      return (
        j.title?.toLowerCase().includes(q)
      );
    });
  }

  if (f.state) out = out.filter((j) => j.state === f.state);
  if (f.jobType && f.jobType !== "")
    out = out.filter((j) => extractId(j.jobType) === f.jobType);
  if (f.jobCategory && f.jobCategory !== "")
    out = out.filter((j) => extractId(j.jobCategory) === f.jobCategory);

  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Job, b: Job) => {
      const av = a?.[key];
      const bv = b?.[key];

      if (key === "createdAt" || key === "updatedAt" || key === "deadline") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    out.sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );
  }

  return out;
}

export default function JobsPage() {
  const [filters, setFilters] = React.useState<JobFilters>({
    search: "",
    state: "",
    jobType: "",
    jobCategory: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Job | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("job:add", handler);
    return () => window.removeEventListener("job:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [
    filters.search,
    filters.state,
    filters.jobType,
    filters.jobCategory,
    filters.sortBy
  ]);

  const query = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Job[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (j: Job) => {
    setSelected(j);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Jobs"
      description="Manage job postings, categories, and job types."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} job(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left: table/cards (Team pattern) */}
          <div className="col-span-12 lg:col-span-9 space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Filters
                value={filters}
                onChange={setFilters}
                onReset={() =>
                  setFilters({
                    search: "",
                    state: "",
                    jobType: "",
                    jobCategory: "",
                    sortBy: ""
                  })
                }
              />

              <JobPagination
                currentPage={page}
                totalPages={totalPages}
                onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                isLoading={query.isFetching}
              />
            </div>

            {/* Mobile list */}
            <div className="grid gap-3 md:hidden">
              {query.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MobileJobSkeletonCard key={i} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load jobs.
                </div>
              ) : paged.length ? (
                paged.map((j) => (
                  <button
                    key={j._id}
                    type="button"
                    onClick={() => openView(j)}
                    className="text-left w-full"
                  >
                    <MobileJobCard job={j} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No jobs found.
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <TableFrame>
                <JobTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>

          {/* Right: panels (Team pattern) */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <JobCategoriesPanel />
            <JobTypesPanel />
          </div>
        </div>

        <JobSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          jobId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
