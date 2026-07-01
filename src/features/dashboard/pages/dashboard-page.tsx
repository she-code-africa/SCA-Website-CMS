"use client";

import * as React from "react";
import { ActivityLogTable } from "@/features/activity-log/components/activity-log-table";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TableShell } from "@/components/templates/table-shell";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export default function DashboardPage() {
  const GA_CLIENT_ID = process.env.NEXT_PUBLIC_GA_CLIENT_ID || "";

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_DASHBOARD}>
      <div className="space-y-6">
        {/* Stats */}
        {GA_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GA_CLIENT_ID}>
            <DashboardStats />
          </GoogleOAuthProvider>
        ) : (
          <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
            Google Analytics Client ID missing.
          </div>
        )}

        {/* Activity log */}
        <TableShell title="Activity Log">
          <ActivityLogTable />
        </TableShell>
      </div>
    </PermissionGate>
  );
}
