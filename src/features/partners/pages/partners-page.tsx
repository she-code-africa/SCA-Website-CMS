"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import { getPartners } from "@/features/partners/api";
import type { Partner, PartnerFilters } from "@/features/partners/types";

import { PartnerFilters as Filters } from "@/features/partners/components/partner-filters";
import { PartnerTable } from "@/features/partners/components/partner-table";
import { MobilePartnerCard } from "@/features/partners/components/mobile-partner-card";
import { MobilePartnerSkeletonCard } from "@/features/partners/components/mobile-partner-skeleton-card";
import { PartnerSheet } from "@/features/partners/components/partner-sheet";
import { PartnerPagination } from "@/features/partners/components/partner-pagination";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: Partner[], f: PartnerFilters) {
  let out = [...rows];
  const q = f.search?.trim().toLowerCase();
  if (q) out = out.filter((p) => p.name?.toLowerCase().includes(q));
  if (f.featured) {
    const isFeatured = f.featured === "true";
    out = out.filter((p) => p.featured === isFeatured);
  }
  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Partner, b: Partner) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (key === "createdAt" || key === "updatedAt") {
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

export default function PartnersPage() {
  const [filters, setFilters] = React.useState<PartnerFilters>({
    search: "",
    featured: "",
    sortBy: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Partner | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("partner:add", handler);
    return () => window.removeEventListener("partner:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.featured, filters.sortBy]);

  const query = useQuery({
    queryKey: ["partners"],
    queryFn: getPartners,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Partner[], filters),
    [query.data, filters]
  );
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (p: Partner) => {
    setSelected(p);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_PARTNER}>
      <TableShell
        title="Partners"
        description="Manage partners displayed on the website."
        right={
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} partner(s)`}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Filters
              value={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({ search: "", featured: "", sortBy: "" })
              }
            />
            <PartnerPagination
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
                    <MobilePartnerSkeletonCard key={`partner-skeleton-${i}`} />
                  ))
                ) : query.isError ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                    Failed to load partners.
                  </div>
                ) : paged.length ? (
                  paged.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => openView(p)}
                      className="text-left w-full"
                    >
                      <MobilePartnerCard partner={p} />
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                    No partners found.
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                <TableFrame>
                  <PartnerTable
                    rows={paged}
                    isLoading={query.isLoading}
                    isError={query.isError}
                    onRowClick={openView}
                  />
                </TableFrame>
              </div>
            </div>
          </div>

          <PartnerSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            partnerId={selected?._id}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
