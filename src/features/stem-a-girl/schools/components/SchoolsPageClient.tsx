"use client";

import dynamic from "next/dynamic";

const SchoolPage = dynamic(
  () => import("@/features/stem-a-girl/schools/pages/schools-page"),
  { ssr: false }
);

export default function SchoolPageClient() {
  return <SchoolPage />;
}
