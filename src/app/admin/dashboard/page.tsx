"use client";

import * as React from "react";
import { ActivityLogTable } from "@/features/activity-log/components/activity-log-table";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TableShell } from "@/components/templates/table-shell";
import { PermissionGate } from "@/components/PermissionGate";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  // Guard against missing env var during build
  const GA_CLIENT_ID = process.env.NEXT_PUBLIC_GA_CLIENT_ID || "";

  return (
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
      <PermissionGate permission="VIEW_DASHBOARD">
        <TableShell title="Activity Log">
          <ActivityLogTable />
        </TableShell>
      </PermissionGate>
    </div>
  );
}
