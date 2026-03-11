// src/app/admin/volunteers/roles/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getVolunteerRoles } from "@/features/volunteer-roles/api";
import type {
  VolunteerRole,
  VolunteerRoleFilters
} from "@/features/volunteer-roles/types";

import { VolunteerRoleFilters as Filters } from "@/features/volunteer-roles/components/volunteer-role-filters";
import { VolunteerRolesPagination } from "@/features/volunteer-roles/components/volunteer-roles-pagination";
import { VolunteerRoleTable } from "@/features/volunteer-roles/components/volunteer-role-table";
import { MobileVolunteerRoleCard } from "@/features/volunteer-roles/components/mobile-volunteer-role-card";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

import { VolunteerRoleSheet } from "@/features/volunteer-roles/components/volunteer-role-sheet";
import { VolunteerRoleFormSheet } from "@/features/volunteer-roles/components/volunteer-role-form-sheet";

function applyClientFilters(rows: VolunteerRole[], f: VolunteerRoleFilters) {
  let out = [...rows];
  const q = f.search.trim().toLowerCase();

  if (q) {
    out = out.filter((r) => {
      return (
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        (r.skills ?? []).some((s) => s.toLowerCase().includes(q))
      );
    });
  }

  out.sort((a, b) => {
    const ad = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const bd = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return bd - ad;
  });

  return out;
}

export default function VolunteerRolesPage() {
  const [filters, setFilters] = React.useState<VolunteerRoleFilters>({
    search: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  // ✅ separate state: create sheet vs details sheet
  const [createOpen, setCreateOpen] = React.useState(false);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsMode, setDetailsMode] = React.useState<"view" | "edit">("view");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => setPage(1), [filters.search]);

  const query = useQuery({
    queryKey: ["volunteer-roles"],
    queryFn: getVolunteerRoles,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as VolunteerRole[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  function openCreate() {
    setCreateOpen(true);
  }

  function openView(r: VolunteerRole) {
    setSelectedId(r._id);
    setDetailsMode("view");
    setDetailsOpen(true);
  }

  return (
    <TableShell
      title="Volunteer Roles"
      description="Create and manage volunteer opportunities displayed on the website."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} role(s)`}
        </div>
      }
    >
      <div className="space-y-4 mt-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "" })}
            onAdd={openCreate}
          />

          <VolunteerRolesPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-3 md:hidden">
          {query.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-background p-4 space-y-3"
              >
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-3 w-72 rounded bg-muted" />
                <div className="h-3 w-56 rounded bg-muted" />
              </div>
            ))
          ) : query.isError ? (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
              Failed to load volunteer roles.
            </div>
          ) : paged.length ? (
            paged.map((r) => (
              <button
                key={r._id}
                type="button"
                onClick={() => openView(r)}
                className="text-left w-full"
              >
                <MobileVolunteerRoleCard row={r} />
              </button>
            ))
          ) : (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
              No volunteer roles yet.
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TableFrame>
            <VolunteerRoleTable
              rows={paged}
              isLoading={query.isLoading}
              isError={query.isError}
              onRowClick={openView}
            />
          </TableFrame>
        </div>

        {/* ✅ Create */}
        <VolunteerRoleFormSheet
          open={createOpen}
          onOpenChange={setCreateOpen}
        />

        {/* ✅ View/Edit */}
        <VolunteerRoleSheet
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          mode={detailsMode}
          roleId={selectedId}
        />
      </div>
    </TableShell>
  );
}
