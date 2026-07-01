"use client";

import dynamic from "next/dynamic";

const ActivitiesPage = dynamic(
  () => import("@/features/stem-a-girl/activities/pages/activities-page"),
  { ssr: false }
);

export default function ActivitiesPageClient() {
  return <ActivitiesPage />;
}
