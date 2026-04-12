// src/components/providers/route-permission-guard.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { getRequiredPermission } from "@/lib/rbac/route-permissions";
import { Loader2 } from "lucide-react";

export function RoutePermissionGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { can, isLoading } = usePermissions();

  useEffect(() => {
    if (isLoading) return;
    const required = getRequiredPermission(pathname);
    if (required && !can(required)) {
      router.replace("/admin/unauthorized"); // or dashboard
    }
  }, [pathname, can, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
