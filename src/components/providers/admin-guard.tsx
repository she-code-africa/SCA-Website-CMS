// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect, useSyncExternalStore } from "react";

// // This is a "No-op" subscriber for the linter's sake
// const subscribe = () => () => {};

// export function AdminGuard({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();

//   // This replaces the useState/useEffect mount logic.
//   // It returns false on the server and true on the client.
//   const isClient = useSyncExternalStore(
//     subscribe,
//     () => true,
//     () => false
//   );

//   useEffect(() => {
//     // Only redirect if we are confirmed on the client and auth is missing
//     if (isClient && !isLoading && !user) {
//       router.replace("/login");
//     }
//   }, [user, isLoading, router, isClient]);

//   // Handle the "Verifying Session" UI
//   // We check !isClient first to ensure the Server and Client start with the same HTML
//   if (!isClient || isLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-slate-900">
//         <div className="text-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-slate-400">Verifying session...</p>
//         </div>
//       </div>
//     );
//   }

//   // If there's no user, return null to prevent content flash during redirect
//   if (!user) return null;

//   return <>{children}</>;
// }





"use client";

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

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function AdminGuard({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // ── Loading state ─────────────────────────────────────────────────────────
  // Show a neutral spinner while auth hydrates.
  // Prevents page content from flashing before redirect.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  // Return null while the redirect fires (avoids content flash)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}