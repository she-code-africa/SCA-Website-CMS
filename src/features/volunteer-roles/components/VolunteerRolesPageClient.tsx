"use client";

import dynamic from "next/dynamic";

const VolunteerRolesPage = dynamic(
  () => import("@/features/volunteer-roles/pages/volunteer-roles-page"),
  { ssr: false }
);

export default function VolunteerRolesPageClient() {
  return <VolunteerRolesPage />;
}
