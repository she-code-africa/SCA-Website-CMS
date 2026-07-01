"use client";

import dynamic from "next/dynamic";

const CompaniesPage = dynamic(
  () => import("@/features/companies/pages/companies-page"),
  { ssr: false }
);

export default function CompaniesPageClient() {
  return <CompaniesPage />;
}
