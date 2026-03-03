"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getUsers,
  getRolesForSelect,
  deactivateUser,
  activateUser,
  deleteUser
} from "@/features/users/api";
import type { AdminUser, UsersFilters } from "@/features/users/types";

import { UserFilters } from "@/features/users/components/user-filters";
import { UserTable } from "@/features/users/components/user-table";
import { MobileUserCard } from "@/features/users/components/mobile-user-card";
import { MobileUserSkeletonCard } from "@/features/users/components/mobile-user-skeleton-card";
import { UserPagination } from "@/features/users/components/user-pagination";
import { UserSheet } from "@/features/users/components/user-invite-sheet";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function UsersPage() {
  const qc = useQueryClient();

  const [filters, setFilters] = React.useState<UsersFilters>({
    search: "",
    roleId: "",
    status: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"invite" | "view">("invite");
  const [selected, setSelected] = React.useState<AdminUser | null>(null);

  // Listen for invite button in filters
const handleOpenInvite = () => {
  setSelected(null);
  setSheetMode("invite");
  setSheetOpen(true);
};

  // Reset to page 1 on filter change
  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.roleId, filters.status]);

  const usersQuery = useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    staleTime: 30_000
  });

  const rolesQuery = useQuery({
    queryKey: ["roles-select"],
    queryFn: getRolesForSelect,
    staleTime: 60_000
  });

  const toggleStatusMut = useMutation({
    mutationFn: (u: AdminUser) =>
      u.status === "active" ? deactivateUser(u.id) : activateUser(u.id),
    onSuccess: (_, u) => {
      toast.success(
        u.status === "active" ? "User deactivated." : "User activated."
      );
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Could not update user status.")
  });

  const deleteMut = useMutation({
    mutationFn: (u: AdminUser) => deleteUser(u.id),
    onSuccess: () => {
      toast.success("User deleted.");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Could not delete user.")
  });

  const rows = usersQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);
  const roles = rolesQuery.data ?? [];

  const openView = (u: AdminUser) => {
    setSelected(u);
    setSheetMode("view");
    setSheetOpen(true);
  };

  return (
    <TableShell
      title="Users"
      description="Manage admin portal users and their role assignments."
      right={
        <div className="text-sm text-muted-foreground">
          {usersQuery.isLoading ? "Loading…" : `${rows.length} user(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <UserFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", roleId: "", status: "" })}
            roles={roles}
            onInvite={handleOpenInvite}
          />
          <UserPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={usersQuery.isFetching}
          />
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 md:hidden">
          {usersQuery.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileUserSkeletonCard key={i} />
            ))
          ) : usersQuery.isError ? (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
              Failed to load users.
            </div>
          ) : paged.length ? (
            paged.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => openView(u)}
                className="text-left w-full"
              >
                <MobileUserCard user={u} />
              </button>
            ))
          ) : (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <TableFrame>
            <UserTable
              rows={paged}
              isLoading={usersQuery.isLoading}
              isError={usersQuery.isError}
              onRowClick={openView}
              onToggleStatus={(u) => toggleStatusMut.mutate(u)}
              onDelete={(u) => deleteMut.mutate(u)}
            />
          </TableFrame>
        </div>
      </div>

      <UserSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        user={selected}
        roles={roles}
      />
    </TableShell>
  );
}
