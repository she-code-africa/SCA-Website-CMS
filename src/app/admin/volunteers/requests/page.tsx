// src/app/admin/volunteers/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getVolunteerRequests } from "@/features/volunteer-requests/api";
import type {
  VolunteerFilters,
  VolunteerRequest
} from "@/features/volunteer-requests/types";

import { VolunteerFilters as Filters } from "@/features/volunteer-requests/components/volunteer-filters";
import { VolunteerTable } from "@/features/volunteer-requests/components/volunteer-table";
import { MobileVolunteerCard } from "@/features/volunteer-requests/components/mobile-volunteer-card";
import { MobileVolunteerSkeletonCard } from "@/features/volunteer-requests/components/mobile-volunteer-skeleton-card";
import { VolunteerDetailsSheet } from "@/features/volunteer-requests/components/volunteer-details-sheet";
import { VolunteerPagination } from "@/features/volunteer-requests/components/volunteer-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

// local filter/sort util
function applyClientFilters(rows: VolunteerRequest[], f: VolunteerFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((v) => {
      return (
        v.fullname?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.currentRole?.toLowerCase().includes(q) ||
        v.purpose?.toLowerCase().includes(q) ||
        v.volunteerRole?.toLowerCase().includes(q)
      );
    });
  }

  if (f.status && f.status !== "all")
    out = out.filter((v) => v.status === f.status);
  if (f.volunteerRole && f.volunteerRole !== "all")
    out = out.filter((v) => v.volunteerRole === f.volunteerRole);

  if (f.sortBy && f.sortBy !== "all") {
    const key = f.sortBy;
    out.sort((a: any, b: any) => {
      const av = a?.[key];
      const bv = b?.[key];

      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  }

  return out;
}

export default function VolunteersPage() {
  const [filters, setFilters] = React.useState<VolunteerFilters>({
    search: "",
    status: "",
    volunteerRole: "",
    sortBy: ""
  });

  // client-side pagination (mirrors team layout)
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<VolunteerRequest | null>(null);

  // reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.volunteerRole, filters.sortBy]);

  const query = useQuery({
    queryKey: ["volunteers"],
    queryFn: getVolunteerRequests,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as VolunteerRequest[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (v: VolunteerRequest) => {
    setSelected(v);
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Volunteer Requests"
      description="Review volunteer requests and update approval status."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} result(s)`}
        </div>
      }
    >
      <div className="space-y-4 mt-4">
        {/* Controls (exact pattern as Team) */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({
                search: "",
                status: "",
                volunteerRole: "",
                sortBy: ""
              })
            }
          />

          <VolunteerPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        {/* Responsive list/table wrapper (exact pattern as Team) */}
        <div className="space-y-3">
          {/* Mobile list */}
          <div className="grid gap-3 md:hidden">
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <MobileVolunteerSkeletonCard key={i} />
              ))
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load volunteer requests.
              </div>
            ) : paged.length ? (
              paged.map((v) => (
                <button
                  key={v._id}
                  type="button"
                  onClick={() => openView(v)}
                  className="text-left w-full"
                >
                  <MobileVolunteerCard row={v} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No volunteer requests found.
              </div>
            )}
          </div>

          {/* Tablet + Desktop table */}
          <div className="hidden md:block">
            <TableFrame>
              <VolunteerTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openView}
              />
            </TableFrame>
          </div>
        </div>

        <VolunteerDetailsSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          id={selected?._id ?? null}
        />
      </div>
    </TableShell>
  );
}
