// src/features/stem-a-girl/enquiries/pages/stem-enquiries-page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStemEnquiries } from "../api";
import type { StemEnquiry, StemEnquiryFilters } from "../types";
import { StemEnquiryTable } from "../components/stem-enquiry-table";
import { StemEnquirySheet } from "../components/stem-enquiry-sheet";
import { StemEnquiryFilters as Filters } from "../components/stem-enquiry-filters";
import { StemEnquiryPagination } from "../components/stem-enquiry-pagination";
import { MobileStemEnquiryCard } from "../components/mobile-stem-enquiry-card";
import { MobileStemEnquirySkeletonCard } from "../components/mobile-stem-enquiry-skeleton-card";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyFilters(rows: StemEnquiry[], filters: StemEnquiryFilters) {
  let out = [...rows];
  const search = filters.search?.trim().toLowerCase();
  if (search) {
    out = out.filter(
      (e) =>
        e.fullName.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.subject.toLowerCase().includes(search)
    );
  }
  if (filters.status) out = out.filter((e) => e.status === filters.status);
  if (filters.startDate)
    out = out.filter(
      (e) => new Date(e.createdAt ?? 0) >= new Date(filters.startDate!)
    );
  if (filters.endDate)
    out = out.filter(
      (e) => new Date(e.createdAt ?? 0) <= new Date(filters.endDate!)
    );
  return out;
}

export default function StemEnquiriesPage() {
  const [filters, setFilters] = React.useState<StemEnquiryFilters>({});
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [sheetMode] = React.useState<"view">("view");

  const {
    data: enquiries = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["stem-enquiries"],
    queryFn: getStemEnquiries,
    staleTime: 30_000
  });

  const filtered = React.useMemo(() => {
    const sorted = [...enquiries].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );
    return applyFilters(sorted, filters);
  }, [enquiries, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const openView = (e: StemEnquiry) => {
    setSelectedId(e._id);
    setSheetOpen(true);
  };
  const openEdit = (e: StemEnquiry) => {
    setSelectedId(e._id);
    setSheetOpen(true);
  };

  return (
    <TableShell
      title="Enquiries"
      description="Manage enquiries from the Stem‑a‑Girl contact form."
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>
        <div className="flex justify-end">
          <StemEnquiryPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={isLoading}
          />
        </div>
        <div className="grid gap-3 md:hidden">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileStemEnquirySkeletonCard key={i} />
            ))
          ) : isError ? (
            <div className="text-red-500">Failed to load</div>
          ) : (
            paged.map((e) => (
              <button key={e._id} onClick={() => openView(e)}>
                <MobileStemEnquiryCard enquiry={e} />
              </button>
            ))
          )}
        </div>
        <div className="hidden md:block">
          <TableFrame>
            <StemEnquiryTable
              rows={paged}
              isLoading={isLoading}
              isError={isError}
              onView={openView}
              onEdit={openEdit}
            />
          </TableFrame>
        </div>
        <StemEnquirySheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          enquiryId={selectedId || undefined}
        />
      </div>
    </TableShell>
  );
}
