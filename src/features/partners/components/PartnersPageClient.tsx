"use client";

import dynamic from "next/dynamic";

const PartnersPage = dynamic(
  () => import("@/features/partners/pages/partners-page"),
  { ssr: false }
);

export default function PartnersPageClient() {
  return <PartnersPage />;
}
