// src/app/admin/enquiries/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

import { getEnquiries } from "@/features/enquiries/api";
import type { Enquiry, EnquiryFilters } from "@/features/enquiries/types";

import { EnquiryFilters as Filters } from "@/features/enquiries/components/enquiry-filters";
import { EnquiryPagination } from "@/features/enquiries/components/enquiry-pagination";
import { EnquiryTable } from "@/features/enquiries/components/enquiry-table";
import { MobileEnquiryCard } from "@/features/enquiries/components/mobile-enquiry-card";
import { MobileEnquirySkeletonCard } from "@/features/enquiries/components/mobile-enquiry-skeleton-card";
import { EnquiryDetailsSheet } from "@/features/enquiries/components/enquiry-details-sheet";

function applyClientFilters(rows: Enquiry[], f: EnquiryFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((e) => {
      return (
        e.fullName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q)
      );
    });
  }

  if (f.status) out = out.filter((e) => (e.status ?? "open") === f.status);

  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Enquiry, b: Enquiry) => {
      const av = a?.[key as keyof Enquiry];
      const bv = b?.[key as keyof Enquiry];

      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    // default: newest updated first (feels right for support inbox)
    out.sort(
      (a, b) =>
        new Date(b.updatedAt ?? 0).getTime() -
        new Date(a.updatedAt ?? 0).getTime()
    );
  }

  return out;
}

export default function EnquiriesPage() {
  const [filters, setFilters] = React.useState<EnquiryFilters>({
    search: "",
    status: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(
    () => setPage(1),
    [filters.search, filters.status, filters.sortBy]
  );

  const query = useQuery({
    queryKey: ["enquiries"],
    queryFn: getEnquiries,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Enquiry[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  function openDetails(e: Enquiry) {
    setSelectedId(e._id);
    setDetailsOpen(true);
  }

  return (
    <TableShell
      title="Enquiries"
      description="Messages submitted through the website contact form."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} enquiry(s)`}
        </div>
      }
    >
      <div className="space-y-4 mt-4">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", status: "", sortBy: "" })}
          />

          <EnquiryPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        {/* Mobile cards + Desktop table */}
        <div className="space-y-3">
          {/* Mobile */}
          <div className="grid gap-3 md:hidden">
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <MobileEnquirySkeletonCard key={i} />
              ))
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load enquiries.
              </div>
            ) : paged.length ? (
              paged.map((e) => (
                <button
                  key={e._id}
                  type="button"
                  onClick={() => openDetails(e)}
                  className="text-left w-full"
                >
                  <MobileEnquiryCard row={e} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No enquiries found.
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            {/* ✅ This is what gives you that "Activity Log table background" feel */}
            <TableFrame>
              <EnquiryTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openDetails}
              />
            </TableFrame>
          </div>
        </div>

        <EnquiryDetailsSheet
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          id={selectedId}
        />
      </div>
    </TableShell>
  );
}
