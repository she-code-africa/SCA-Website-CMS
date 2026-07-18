// src/components/providers/admin-guard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps all /admin/** pages. Redirects unauthenticated users to /login.
// Also handles the initial loading state so pages don't flash before
// the auth session is hydrated.
//
// Place this inside src/app/admin/layout.tsx:
//
//   import { AuthProvider } from "@/context/AuthContext";
//   import { AdminGuard }   from "@/components/providers/admin-guard";
//
//   export default function AdminLayout({ children }) {
//     return (
//       <AuthProvider>
//         <AdminGuard>{children}</AdminGuard>
//       </AuthProvider>
//     );
//   }
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { GlobeLoader } from "@/components/ui/globe-loader";
import { logout } from "@/lib/auth/logout";

interface Props {
  children: React.ReactNode;
}

export function AdminGuard({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = React.useRef(false); 

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true; 
      logout({ redirectTo: "/login" });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <GlobeLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}