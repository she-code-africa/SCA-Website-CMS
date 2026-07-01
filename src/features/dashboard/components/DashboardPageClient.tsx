"use client";

import dynamic from "next/dynamic";

const DashboardPage = dynamic(
  () => import("@/features/dashboard/pages/dashboard-page"),
  { ssr: false }
);

export default function DashboardPageClient() {
  return <DashboardPage />;
}
