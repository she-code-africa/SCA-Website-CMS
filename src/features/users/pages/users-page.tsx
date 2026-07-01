// src/app/admin/users/page.tsx

"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { UserTable } from "@/features/users/components/user-table";
import { UserSheet } from "@/features/users/components/user-invite-sheet";
import { UserFilters } from "@/features/users/components/user-filters";
import { UserPagination } from "@/features/users/components/user-pagination";
import { MobileUserCard } from "@/features/users/components/mobile-user-card";
import { MobileUserSkeletonCard } from "@/features/users/components/mobile-user-skeleton-card";
import {
  getUsers,
  getRoles,
  getInvitations,
  inviteUser,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser
} from "@/features/users/api";
import type {
  AdminUser,
  UsersFilters,
  Invitation,
  InviteUserInput
} from "@/features/users/types";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    return data?.message || data?.error || error.message || "An error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};

export default function UsersPage() {
  const qc = useQueryClient();

  // Filter state – no page/limit here
  const [filters, setFilters] = React.useState<UsersFilters>({
    search: "",
    roleId: "",
    status: ""
  });

  // Pagination state
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(
    null
  );
  const [sheetMode, setSheetMode] = React.useState<"invite" | "view">("view");
  

  // Reset page when any filter changes
  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.roleId, filters.status]);

  // Queries – fetch all users (no server pagination)
  const usersQuery = useQuery({
    queryKey: ["users", { roleId: filters.roleId, status: filters.status }],
    queryFn: () => getUsers({ ...filters, search: "" })
  });
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles
  });
  const invitationsQuery = useQuery({
    queryKey: ["invitations"],
    queryFn: getInvitations
  });

  // Merge active users + pending invitations, then sort: pending first, then active, then deactivated
  const allRows = React.useMemo(() => {
    const users = usersQuery.data?.users ?? [];
    const roles = rolesQuery.data ?? [];
    const invitations = invitationsQuery.data ?? [];

    // Create role map for fast lookup
    const roleMap = new Map(roles.map((r) => [r._id, r]));

    // Filter only pending invitations (case‑insensitive)
    const pendingInvites = invitations.filter(
      (inv: Invitation) => inv.status?.toLowerCase() === "pending"
    );

    const inviteRows: AdminUser[] = pendingInvites.map((inv) => {
      const roleObj = roleMap.get(inv.role);
      return {
        _id: inv._id,
        id: inv._id,
        firstName: "",
        lastName: "",
        email: inv.email,
        role: roleObj ? roleObj._id : inv.role, // store role ID
        status: "pending",
        isActive: false,
        createdAt: inv.createdAt, // backend uses createdAt for invited date
        lastLogin: null
      };
    });

    // Combine all users (including pending invites)
    const all = [...inviteRows, ...users];

    // Sort: pending (0) → active (1) → deactivated (2)
    return all.sort((a, b) => {
      const getStatusOrder = (user: AdminUser): number => {
        if (user.status === "pending") return 0;
        const isActive = user.isActive ?? user.status === "active";
        return isActive ? 1 : 2;
      };
      return getStatusOrder(a) - getStatusOrder(b);
    });
  }, [usersQuery.data, rolesQuery.data, invitationsQuery.data]);

  // Client‑side search filtering
  const filteredRows = React.useMemo(() => {
    if (!filters.search?.trim()) return allRows;
    const searchLower = filters.search.toLowerCase().trim();
    return allRows.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        user.email.toLowerCase().includes(searchLower) ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower)
      );
    });
  }, [allRows, filters.search]);

  // Client‑side pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / limit));
  const pagedRows = filteredRows.slice((page - 1) * limit, page * limit);

  // Handlers
  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Mutations
  const inviteMutation = useMutation({
    mutationFn: (input: InviteUserInput) => inviteUser(input),
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["invitations"] });
      setSheetOpen(false);
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error))
  });

  const roleUpdateMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      updateUserRole(userId, roleId),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error))
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      const userId = user._id;
      if (user.isActive) await deactivateUser(userId);
      else await activateUser(userId);
    },
    onSuccess: (_, user) => {
      toast.success(user.isActive ? "User deactivated" : "User activated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Status change failed")
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: () => toast.error("Delete failed")
  });

  // Handlers for user actions
  const handleInvite = async (email: string, roleId: string) => {
    const roles = rolesQuery.data ?? [];
    const selectedRole = roles.find((r) => r._id === roleId);
    if (!selectedRole) {
      toast.error("Please select a valid role");
      return;
    }
    await inviteMutation.mutateAsync({
      email,
      roleName: selectedRole.name,
      roleId: selectedRole._id
    });
  };

  const handleRoleUpdate = async (userId: string, newRoleId: string) => {
    await roleUpdateMutation.mutateAsync({ userId, roleId: newRoleId });
  };

  const handleToggleStatus = async (user: AdminUser) => {
    if (user.status === "pending") {
      toast.warning("Cannot activate/deactivate pending invitation.");
      return;
    }
    await toggleStatusMutation.mutateAsync(user);
  };

  const handleDelete = (user: AdminUser) => {
    if (window.confirm(`Delete ${user.email} permanently?`)) {
      deleteMutation.mutate(user._id);
    }
  };

  const openSheet = (user: AdminUser | null, mode: "invite" | "view") => {
    setSelectedUser(user);
    setSheetMode(mode);
    setSheetOpen(true);
  };

  const handleFilterChange = (newFilters: UsersFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", roleId: "", status: "" });
    setPage(1);
  };

  const rolesForFilters = React.useMemo(() => {
    const roles = rolesQuery.data ?? [];
    return roles.map((r) => ({ id: r._id, name: r.name }));
  }, [rolesQuery.data]);

  const isLoading =
    usersQuery.isLoading || rolesQuery.isLoading || invitationsQuery.isLoading;
  const isError = usersQuery.isError || rolesQuery.isError;

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_USER}>
      <div className="container py-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <UserFilters
              value={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              roles={rolesForFilters}
              onInvite={() => openSheet(null, "invite")}
            />
            <UserPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isLoading={isLoading}
            />
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <MobileUserSkeletonCard key={i} />
              ))
            ) : isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load users.
              </div>
            ) : pagedRows.length ? (
              pagedRows.map((u) => (
                <MobileUserCard
                  key={u._id || u.id}
                  user={u}
                  roles={rolesQuery.data ?? []}
                  onClick={() => openSheet(u, "view")}
                />
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No users found.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <UserTable
              rows={pagedRows}
              roles={rolesQuery.data ?? []}
              isLoading={isLoading}
              isError={isError}
              canEdit={true}
              onRowClick={(user) => openSheet(user, "view")}
            />
          </div>
        </div>

        <UserSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          user={selectedUser}
          roles={rolesQuery.data ?? []}
          onInvite={handleInvite}
          onRoleUpdate={handleRoleUpdate}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          isSaving={inviteMutation.isPending || roleUpdateMutation.isPending}
        />
      </div>
    </PermissionGate>
  );
}
