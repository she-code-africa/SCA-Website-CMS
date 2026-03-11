"use client";

import dynamic from "next/dynamic";

const ReportsPage = dynamic(
  () => import("@/features/reports/pages/reports-page"),
  { ssr: false }
);

export default function ReportsPageClient() {
  return <ReportsPage />;
}
