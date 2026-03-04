"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run redirection logic if we are in the browser
    if (typeof window !== "undefined" && !isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Handle the "Verifying Session" UI
  if (isLoading) {
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
