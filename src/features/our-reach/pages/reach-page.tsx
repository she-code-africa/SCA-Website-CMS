"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getOurReach } from "@/features/our-reach/api";
import type { Reach, ReachFilters } from "@/features/our-reach/types";
import { ReachFilters as Filters } from "@/features/our-reach/components/reach-filters";
import { ReachTable } from "@/features/our-reach/components/reach-table";
import { MobileReachCard } from "@/features/our-reach/components/mobile-reach-card";
import { MobileReachSkeletonCard } from "@/features/our-reach/components/mobile-reach-skeleton-card";
import { ReachSheet } from "@/features/our-reach/components/reach-sheet";
import { ReachPagination } from "@/features/our-reach/components/reach-pagination";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: Reach[], f: ReachFilters) {
  let out = [...rows];
  const q = f.search?.trim().toLowerCase();
  if (q) out = out.filter((r) => r.name?.toLowerCase().includes(q));
  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Reach, b: Reach) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      if (key === "value") return Number(bv ?? 0) - Number(av ?? 0);
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    out.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }
  return out;
}

export default function OurReachPage() {
  const [filters, setFilters] = React.useState<ReachFilters>({
    search: "",
    sortBy: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Reach | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("reach:add", handler);
    return () => window.removeEventListener("reach:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.sortBy]);

  const query = useQuery({
    queryKey: ["our-reach"],
    queryFn: getOurReach,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Reach[], filters),
    [query.data, filters]
  );
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (r: Reach) => {
    setSelected(r);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_OUR_REACH}>
      <TableShell
        title="Our Reach"
        description="Manage the stats displayed in the Our Reach section."
        right={
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} item(s)`}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Filters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: "", sortBy: "" })}
            />
            <ReachPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-12 space-y-3">
              <div className="grid gap-3 md:hidden">
                {query.isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <MobileReachSkeletonCard key={i} />
                  ))
                ) : query.isError ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                    Failed to load our reach stats.
                  </div>
                ) : paged.length ? (
                  paged.map((r, index) => (
                    <button
                      key={r._id || `reach-item-${index}`}
                      type="button"
                      onClick={() => openView(r)}
                      className="text-left w-full"
                    >
                      <MobileReachCard reach={r} />
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                    No reach stats found.
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                <TableFrame>
                  <ReachTable
                    rows={paged}
                    isLoading={query.isLoading}
                    isError={query.isError}
                    onRowClick={openView}
                  />
                </TableFrame>
              </div>
            </div>
          </div>

          <ReachSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            reachId={selected?._id}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
