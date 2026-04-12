"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import { getRoles, deleteRole } from "@/features/roles/api";
import type { RoleDetail, RolesFilters } from "@/features/roles/types";

import { RolesFiltersBar } from "@/features/roles/components/roles-filters";
import { RolesPagination } from "@/features/roles/components/roles-pagination";
import { RolesTable } from "@/features/roles/components/roles-table";
import { MobileRoleCard } from "@/features/roles/components/mobile-role-card";
import { MobileRoleSkeletonCard } from "@/features/roles/components/mobile-role-skeleton-card";
import { RoleSheet } from "@/features/roles/components/role-sheet";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function RolesPage() {
  const qc = useQueryClient();

  const [filters, setFilters] = React.useState<RolesFilters>({
    search: "",
    type: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<RoleDetail | null>(null);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.type]);

  const rolesQuery = useQuery({
    queryKey: ["roles", filters],
    queryFn: () => getRoles(filters),
    staleTime: 30_000
  });

  const deleteMut = useMutation({
    mutationFn: (r: RoleDetail) => deleteRole(r.id),
    onSuccess: () => {
      toast.success("Role deleted.");
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Could not delete role.")
  });

  const rows = rolesQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const activePage = Math.min(page, totalPages);
  const paged = rows.slice((activePage - 1) * limit, activePage * limit);

  const openView = (r: RoleDetail) => {
    setSelected(r);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const openCreate = () => {
    setSelected(null);
    setSheetMode("create");
    setSheetOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_ROLE}>
      <TableShell
        title="Roles & Permissions"
        description="Manage system and custom roles. Default roles cannot be edited or deleted."
        right={
          <div className="text-sm text-muted-foreground">
            {rolesQuery.isLoading ? "Loading…" : `${rows.length} role(s)`}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <RolesFiltersBar
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: "", type: "" })}
              onCreate={openCreate}
            />
            <RolesPagination
              currentPage={activePage}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={rolesQuery.isFetching}
            />
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {rolesQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <MobileRoleSkeletonCard key={i} />
              ))
            ) : rolesQuery.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load roles.
              </div>
            ) : paged.length ? (
              paged.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => openView(r)}
                  className="text-left w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                >
                  <MobileRoleCard role={r} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No roles found.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <TableFrame>
              <RolesTable
                rows={paged}
                isLoading={rolesQuery.isLoading}
                isError={rolesQuery.isError}
                onRowClick={openView}
                onDelete={(r) => deleteMut.mutate(r)}
              />
            </TableFrame>
          </div>
        </div>

        <RoleSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          role={selected}
        />
      </TableShell>
    </PermissionGate>
  );
}
