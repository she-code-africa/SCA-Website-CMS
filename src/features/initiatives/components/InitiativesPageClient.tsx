"use client";

import dynamic from "next/dynamic";

const InitiativesPage = dynamic(
  () => import("@/features/initiatives/pages/initiatives-page"),
  { ssr: false }
);

export default function InitiativesPageClient() {
  return <InitiativesPage />;
}
