import { ActivityLogTable } from "@/features/activity-log/components/activity-log-table";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TableShell } from "@/components/templates/table-shell";

export default function DashboardPage() {
  const GA_CLIENT_ID = process.env.NEXT_PUBLIC_GA_CLIENT_ID!;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <GoogleOAuthProvider clientId={GA_CLIENT_ID}>
        <DashboardStats />
      </GoogleOAuthProvider>

      {/* Activity log */}
      <TableShell title="Activity Log">
        <ActivityLogTable />
      </TableShell>
    </div>
  );
}
