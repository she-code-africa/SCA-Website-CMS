"use client";

import dynamic from "next/dynamic";

const ReportsPage = dynamic(
  () => import("@/features/reports/pages/reports-page"),
  {
    ssr: false,
    // Optional loading fallback – rendered on the server, but it's safe
    loading: () => <div>Loading reports…</div>
  }
);

export default function ReportsPageClient() {
  return <ReportsPage />;
}
