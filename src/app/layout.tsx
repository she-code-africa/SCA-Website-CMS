import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";

// import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "SCA Admin",
  description: "SheCode Africa Admin Dashboard"
};


// Dynamic import with SSR disabled
const ClientProviders = React.lazy(
  () => import("@/components/providers/ClientProviders")
);

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
