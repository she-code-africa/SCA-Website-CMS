// "use client";

// // src/components/PermissionGate.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Conditionally renders children based on the current user's permissions.
// //
// // Examples:
// //
// //   // Single permission check
// //   <PermissionGate permission={PERMISSIONS.DELETE_TEAM}>
// //     <Button variant="destructive">Delete</Button>
// //   </PermissionGate>
// //
// //   // With fallback when permission denied
// //   <PermissionGate permission={PERMISSIONS.CREATE_USER} fallback={<p>No access</p>}>
// //     <InviteUserButton />
// //   </PermissionGate>
// //
// //   // At least one of several permissions
// //   <PermissionGate anyOf={[PERMISSIONS.CREATE_EVENT, PERMISSIONS.UPDATE_EVENT]}>
// //     <EventFormButton />
// //   </PermissionGate>
// // ─────────────────────────────────────────────────────────────────────────────

"use client";

import type { ReactNode } from "react";
import type { Permission } from "@/lib/rbac/permissions";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
}

export function PermissionGate({
  children,
  fallback = null,
  permission,
  anyOf,
  allOf
}: PermissionGateProps) {
  // 1. Pull isLoading directly from usePermissions hook!
  const { can, canAny, canAll, isLoading } = usePermissions(); // 2. If Auth is still fetching, do not evaluate permissions yet.
  // You can return null or a loading spinner here.

  if (isLoading) {
    return null; // Or <div className="animate-pulse">Loading...</div>
  }

  if (!permission && !anyOf && !allOf) return <>{children}</>;

  const hasSingle = permission ? can(permission) : true;
  const hasAny = anyOf && anyOf.length > 0 ? canAny(anyOf) : true;
  const hasAll = allOf && allOf.length > 0 ? canAll(allOf) : true;

  const hasAccess = hasSingle && hasAny && hasAll;

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
