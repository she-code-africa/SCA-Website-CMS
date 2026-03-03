"use client";

// src/components/PermissionGate.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Conditionally renders children based on the current user's permissions.
//
// Examples:
//
//   // Single permission check
//   <PermissionGate permission="DELETE_TEAM">
//     <Button variant="destructive">Delete</Button>
//   </PermissionGate>
//
//   // With fallback when permission denied
//   <PermissionGate permission="CREATE_USER" fallback={<p>No access</p>}>
//     <InviteUserButton />
//   </PermissionGate>
//
//   // At least one of several permissions
//   <PermissionGate anyOf={["CREATE_EVENT", "UPDATE_EVENT"]}>
//     <EventFormButton />
//   </PermissionGate>
//
//   // All permissions required
//   <PermissionGate allOf={["VIEW_ROLE", "CREATE_ROLE"]}>
//     <RoleManager />
//   </PermissionGate>
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from "react";
import type { Permission } from "@/lib/rbac/permissions";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  children: ReactNode;
  /** Shown when permission is denied. Defaults to null (renders nothing). */
  fallback?: ReactNode;
  /** Single permission — user must have this */
  permission?: Permission;
  /** User must have at least ONE of these */
  anyOf?: Permission[];
  /** User must have ALL of these */
  allOf?: Permission[];
}

export function PermissionGate({
  children,
  fallback = null,
  permission,
  anyOf,
  allOf
}: PermissionGateProps) {
  const { can, canAny, canAll } = usePermissions();

  // If no props are passed, default to access granted
  if (!permission && !anyOf && !allOf) return <>{children}</>;

  const hasSingle = permission ? can(permission) : true;
  const hasAny = anyOf && anyOf.length > 0 ? canAny(anyOf) : true;
  const hasAll = allOf && allOf.length > 0 ? canAll(allOf) : true;

  const hasAccess = hasSingle && hasAny && hasAll;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}