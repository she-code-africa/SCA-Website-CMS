"use client";

import dynamic from "next/dynamic";

const JobsPage = dynamic(
  () => import("@/features/jobs/pages/jobs-page"),
  { ssr: false }
);

export default function YourPageClient() {
  return <JobsPage />;
}
