"use client";

import dynamic from "next/dynamic";

const TeamPage = dynamic(
  () => import("@/features/team/pages/team-page"),
  { ssr: false }
);

export default function TeamPageClient() {
  return <TeamPage />;
}
