// src/app/admin/initiatives/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getInitiatives } from "@/features/initiatives/api";
import type {
  Initiative,
  InitiativeFilters
} from "@/features/initiatives/types";

import { InitiativeFilters as Filters } from "@/features/initiatives/components/initiative-filters";
import { InitiativeTable } from "@/features/initiatives/components/initiative-table";
import { MobileInitiativeCard } from "@/features/initiatives/components/mobile-initiative-card";
import { MobileInitiativeSkeletonCard } from "@/features/initiatives/components/mobile-initiative-skeleton-card";
import { InitiativeSheet } from "@/features/initiatives/components/initiative-sheet";
import { InitiativePagination } from "@/features/initiatives/components/initiative-pagination";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: Initiative[], f: InitiativeFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((i) => {
      return i.title?.toLowerCase().includes(q);
    });
  }

  if (f.isAvailable && f.isAvailable !== "") {
    const isAvail = f.isAvailable === "true";
    out = out.filter((i) => i.isAvailable === isAvail);
  }

  if (f.sortBy && f.sortBy !== "") {
    const key = f.sortBy;
    out.sort((a: any, b: any) => {
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

export default function InitiativesPage() {
  const [filters, setFilters] = React.useState<InitiativeFilters>({
    search: "",
    isAvailable: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Initiative | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("initiative:add", handler);
    return () => window.removeEventListener("initiative:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.isAvailable, filters.sortBy]);

  const query = useQuery({
    queryKey: ["initiatives"],
    queryFn: getInitiatives,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Initiative[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (i: Initiative) => {
    setSelected(i);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Initiatives"
      description="Manage initiatives and their availability."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} initiative(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({ search: "", isAvailable: "", sortBy: "" })
            }
          />

          <InitiativePagination
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
                  <MobileInitiativeSkeletonCard key={i} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load initiatives.
                </div>
              ) : paged.length ? (
                paged.map((i) => (
                  <button
                    key={i._id}
                    type="button"
                    onClick={() => openView(i)}
                    className="text-left w-full"
                  >
                    <MobileInitiativeCard initiative={i} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No initiatives found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <InitiativeTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>
        </div>

        <InitiativeSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          initiativeId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
