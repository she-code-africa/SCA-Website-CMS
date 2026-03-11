"use client";

import dynamic from "next/dynamic";

const VolunteerRequestsPage = dynamic(
  () => import("@/features/volunteer-requests/pages/volunteer-requests-page"),
  { ssr: false }
);

export default function VolunteerRequestsPageClient() {
  return <VolunteerRequestsPage />;
}
