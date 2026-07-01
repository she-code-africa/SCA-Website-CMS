// src/components/molecules/permission-link.tsx
"use client";

import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/lib/rbac/permissions";

interface Props {
  href: string;
  permission: Permission;
  children: React.ReactNode;
  className?: string;
}

export function PermissionLink({
  href,
  permission,
  children,
  className
}: Props) {
  const { can } = usePermissions();
  if (!can(permission)) return null;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
