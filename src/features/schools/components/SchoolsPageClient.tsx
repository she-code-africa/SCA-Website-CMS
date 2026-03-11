"use client";

import dynamic from "next/dynamic";

const SchoolPage = dynamic(
  () => import("@/features/schools/pages/schools-page"),
  { ssr: false }
);

export default function SchoolsPageClient() {
  return <SchoolPage />;
}
