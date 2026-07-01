// app/admin/layout.tsx
import { Sidebar } from "@/components/organisms/Sidebar";
import { Topbar } from "@/components/organisms/Topbar";
import { AuthProvider } from "@/context/AuthContext";
import { AdminGuard } from "@/components/providers/admin-guard";
import { RoutePermissionGuard } from "@/components/providers/route-permission-guard";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>
        <RoutePermissionGuard>
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
        </RoutePermissionGuard>
      </AdminGuard>
    </AuthProvider>
  );
}
