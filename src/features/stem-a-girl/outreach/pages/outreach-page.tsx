// src/features/stem-a-girl/outreach/pages/outreach-page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOutreaches } from "../api";
import type { Outreach, OutreachFilters } from "../types";
import { OutreachTable } from "../components/outreach-table";
import { OutreachSheet } from "../components/outreach-sheet";
import { OutreachFilters as Filters } from "../components/outreach-filters";
import { OutreachPagination } from "../components/outreach-pagination";
import { MobileOutreachCard } from "../components/mobile-outreach-card";
import { MobileOutreachSkeletonCard } from "../components/mobile-outreach-skeleton-card";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

function applyFilters(rows: Outreach[], filters: OutreachFilters) {
  let out = [...rows];
  const search = filters.search?.trim().toLowerCase();
  if (search) {
    out = out.filter(
      (o) =>
        o.state.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search)
    );
  }
  if (filters.state) {
    const stateFilter = filters.state.toLowerCase();
    out = out.filter((o) => o.state.toLowerCase().includes(stateFilter));
  }
  if (filters.startDate) {
    const start = new Date(filters.startDate);
    out = out.filter((o) => new Date(o.outreachDate) >= start);
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    out = out.filter((o) => new Date(o.outreachDate) <= end);
  }
  return out;
}

export default function OutreachPage() {
  const [filters, setFilters] = React.useState<OutreachFilters>({});
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const {
    data: outreaches = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["outreaches"],
    queryFn: getOutreaches,
    staleTime: 30_000
  });

  const filtered = React.useMemo(() => {
    const sorted = [...outreaches].sort(
      (a, b) =>
        new Date(b.outreachDate ?? 0).getTime() -
        new Date(a.outreachDate ?? 0).getTime()
    );
    return applyFilters(sorted, filters);
  }, [outreaches, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  React.useEffect(() => {
    const handler = () => {
      setSelectedId(null);
      setSheetMode("create");
      setSheetOpen(true);
    };
    window.addEventListener("outreach:add", handler);
    return () => window.removeEventListener("outreach:add", handler);
  }, []);

  const openView = (o: Outreach) => {
    setSelectedId(o._id);
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (o: Outreach) => {
    setSelectedId(o._id);
    setSheetMode("view");
    setSheetOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_SAG_OUTREACH}>
      <TableShell
        title="Outreach"
        description="Manage outreach events and their galleries."
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
            <OutreachPagination
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
                <MobileOutreachSkeletonCard key={i} />
              ))
            ) : isError ? (
              <div className="text-red-500">Failed to load</div>
            ) : (
              paged.map((o) => (
                <button key={o._id} onClick={() => openView(o)}>
                  <MobileOutreachCard outreach={o} />
                </button>
              ))
            )}
          </div>
          <div className="hidden md:block">
            <TableFrame>
              <OutreachTable
                rows={paged}
                isLoading={isLoading}
                isError={isError}
                onView={openView}
                onEdit={openEdit}
              />
            </TableFrame>
          </div>
          <OutreachSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            mode={sheetMode}
            outreachId={selectedId || undefined}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
