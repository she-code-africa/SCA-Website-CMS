"use client";

import dynamic from "next/dynamic";

const TalentRequestPage = dynamic(
  () => import("@/features/talent-requests/pages/talent-request-page"),
  { ssr: false }
);

export default function TalentRequestPageClient() {
  return <TalentRequestPage />;
}
