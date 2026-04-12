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

// API error response shape (adjust based on your backend)
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

  const [filters, setFilters] = React.useState<UsersFilters>({
    page: 1,
    limit: 10,
    search: "",
    roleId: "",
    status: ""
  });

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(
    null
  );
  const [sheetMode, setSheetMode] = React.useState<"invite" | "view">("view");

  // Reset page when role or status changes (search is client‑side)
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [filters.roleId, filters.status]);

  // Queries
  const usersQuery = useQuery({
    queryKey: [
      "users",
      {
        roleId: filters.roleId,
        status: filters.status,
        page: filters.page,
        limit: filters.limit
      }
    ],
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

  const totalPages = usersQuery.data?.totalPages ?? 1;

  // Merge active users + pending invitations
  const allRows = React.useMemo(() => {
    const users = usersQuery.data?.users ?? [];
    const roles = rolesQuery.data ?? [];
    const invitations = invitationsQuery.data ?? [];

    const pendingInvites = invitations.filter(
      (inv: Invitation) => inv.status === "pending"
    );
    const inviteRows: AdminUser[] = pendingInvites.map((inv) => {
      const roleObj = roles.find((r) => r._id === inv.roleId);
      return {
        _id: inv._id,
        id: inv._id,
        firstName: "",
        lastName: "",
        email: inv.email,
        role: roleObj ? roleObj._id : inv.roleId,
        status: "pending",
        isActive: false,
        createdAt: inv.invitedAt,
        lastLogin: null
      };
    });
    return [...users, ...inviteRows];
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

  // Pagination: if search is active, show all results on one page
  const paginatedRows = React.useMemo(() => {
    if (filters.search?.trim()) return filteredRows;
    const start = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);
    const end = start + (filters.limit ?? 10);
    return filteredRows.slice(start, end);
  }, [filteredRows, filters.page, filters.limit, filters.search]);

  const displayedTotalPages = filters.search?.trim() ? 1 : totalPages;

  // Mutations with proper error handling
  const inviteMutation = useMutation({
    mutationFn: (input: InviteUserInput) => inviteUser(input),
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["invitations"] });
      setSheetOpen(false);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    }
  });

  const roleUpdateMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      updateUserRole(userId, roleId),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    }
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

  // Handlers
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
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      roleId: "",
      status: ""
    });
  };

  const goToPreviousPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, (prev.page ?? 1) - 1)
    }));
  };

  const goToNextPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: Math.min(displayedTotalPages, (prev.page ?? 1) + 1)
    }));
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
              currentPage={filters.page ?? 1}
              totalPages={displayedTotalPages}
              onPrevious={goToPreviousPage}
              onNext={goToNextPage}
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
            ) : paginatedRows.length ? (
              paginatedRows.map((u) => (
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
              rows={paginatedRows}
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
