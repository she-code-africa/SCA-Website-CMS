"use client";

// src/hooks/usePermissions.ts
// ─────────────────────────────────────────────────────────────────────────────
// Usage:
//   const { can, canAny, canAll } = usePermissions()
//
//   can("DELETE_TEAM")                     → true/false
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
  /** The full Set of permissions the current user has — for O(1) lookups */
  permissionSet: Set<Permission>;

  isLoading: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { user, isLoading } = useAuth();

  // AuthContext provides a Set for fast O(1) lookups
  const permissionSet: Set<Permission> = user?.permissionSet ?? new Set();

  // 1. Check single permission
  const can = (permission: Permission): boolean => {
    return permissionSet.has(permission);
  };

  // 2. Check if user has at least one in the list
  const canAny = (permissions: Permission[]): boolean => {
    return permissions.some((p) => permissionSet.has(p));
  };

  // 3. Check if user has ALL in the list
  const canAll = (permissions: Permission[]): boolean => {
    return permissions.every((p) => permissionSet.has(p));
  };

  return { can, canAny, canAll, permissionSet, isLoading };
}
