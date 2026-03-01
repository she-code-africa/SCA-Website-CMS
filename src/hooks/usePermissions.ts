"use client";

// src/hooks/usePermissions.ts
// ─────────────────────────────────────────────────────────────────────────────
// Usage:
//   const { can, canAny, canAll, isAdmin } = usePermissions()
//
//   can("DELETE_TEAM")                          → true/false
//   canAny(["CREATE_EVENT", "UPDATE_EVENT"])    → true if user has at least one
//   canAll(["VIEW_ROLE", "CREATE_ROLE"])        → true only if user has all
// ─────────────────────────────────────────────────────────────────────────────

import { useAuth } from "@/context/AuthContext";
import type { Permission } from "@/lib/rbac/permissions";

interface UsePermissionsReturn {
  /** Check if the current user has a single permission */
  can: (permission: Permission) => boolean;
  /** Check if the current user has at least one of the given permissions */
  canAny: (permissions: Permission[]) => boolean;
  /** Check if the current user has ALL of the given permissions */
  canAll: (permissions: Permission[]) => boolean;
  /** Whether the current user is an Administrator (all permissions) */
  isAdmin: boolean;
  /** The full Set of permissions the current user has — for advanced checks */
  permissionSet: Set<Permission>;
}

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();

  const isAdmin = user?.role?.name === "Administrator";

  // Use the pre-built Set from AuthContext for O(1) lookups
  const permissionSet: Set<Permission> = user?.permissionSet ?? new Set();

  const can = (permission: Permission): boolean => {
    if (isAdmin) return true;
    return permissionSet.has(permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    if (isAdmin) return true;
    return permissions.some((p) => permissionSet.has(p));
  };

  const canAll = (permissions: Permission[]): boolean => {
    if (isAdmin) return true;
    return permissions.every((p) => permissionSet.has(p));
  };

  return { can, canAny, canAll, isAdmin, permissionSet };
}
