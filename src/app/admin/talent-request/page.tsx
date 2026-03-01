// src/app/admin/talent-request/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getTalentRequests } from "@/features/talent-requests/api";
import type {
  TalentRequest,
  TalentRequestFilters
} from "@/features/talent-requests/types";

import { TalentRequestFilters as Filters } from "@/features/talent-requests/components/talent-filters";
import { TalentRequestPagination } from "@/features/talent-requests/components/talent-pagination";
import { TalentTable } from "@/features/talent-requests/components/talent-table";
import { MobileTalentCard } from "@/features/talent-requests/components/mobile-talent-card";
import { MobileTalentSkeletonCard } from "@/features/talent-requests/components/mobile-talent-skeleton-card";
import { TalentRequestDetailsSheet } from "@/features/talent-requests/components/talent-details-sheet";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: TalentRequest[], f: TalentRequestFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((t) => {
      return (
        t.fullname?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.company?.toLowerCase().includes(q) ||
        t.jobRole?.toLowerCase().includes(q) ||
        t.jobDescription?.toLowerCase().includes(q)
      );
    });
  }

  if (f.status) out = out.filter((t) => (t.status ?? "Pending") === f.status);

  if (f.experienceLevel?.trim()) {
    const x = f.experienceLevel.trim().toLowerCase();
    out = out.filter((t) =>
      (t.experienceLevel ?? "").toLowerCase().includes(x)
    );
  }

  if (f.sortBy) {
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

export default function TalentRequestPage() {
  const [filters, setFilters] = React.useState<TalentRequestFilters>({
    search: "",
    status: "",
    experienceLevel: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [detailsOpen, setDetailsOpen] = React.useState(false);
const [selected, setSelected] = React.useState<TalentRequest | null>(null);

  React.useEffect(
    () => setPage(1),
    [filters.search, filters.status, filters.experienceLevel, filters.sortBy]
  );

  const query = useQuery({
    queryKey: ["talent-requests"],
    queryFn: getTalentRequests,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as TalentRequest[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

function openDetails(row: TalentRequest) {
  setSelected(row);
  setDetailsOpen(true);
}

  return (
    <TableShell
      title="Talent Requests"
      description="Review talent requests and view submitted details."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} result(s)`}
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
                status: "",
                experienceLevel: "",
                sortBy: ""
              })
            }
          />

          <TalentRequestPagination
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
              Array.from({ length: 6 }).map((_, i) => (
                <MobileTalentSkeletonCard key={i} />
              ))
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load talent requests.
              </div>
            ) : paged.length ? (
              paged.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => openDetails(t)}
                  className="text-left w-full"
                >
                  <MobileTalentCard row={t} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No talent requests found.
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <TableFrame>
              <TalentTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openDetails}
              />
            </TableFrame>
          </div>
        </div>

        <TalentRequestDetailsSheet
          open={detailsOpen}
          onOpenChange={(v) => {
            setDetailsOpen(v);
            if (!v) setSelected(null);
          }}
          row={selected}
        />
      </div>
    </TableShell>
  );
}
