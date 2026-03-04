"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

// This is a "No-op" subscriber for the linter's sake
const subscribe = () => () => {};

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // This replaces the useState/useEffect mount logic.
  // It returns false on the server and true on the client.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    // Only redirect if we are confirmed on the client and auth is missing
    if (isClient && !isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router, isClient]);

  // Handle the "Verifying Session" UI
  // We check !isClient first to ensure the Server and Client start with the same HTML
  if (!isClient || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If there's no user, return null to prevent content flash during redirect
  if (!user) return null;

  return <>{children}</>;
}
