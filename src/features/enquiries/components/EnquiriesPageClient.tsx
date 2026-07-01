"use client";

import dynamic from "next/dynamic";

const EnquiriesPage = dynamic(
  () => import("@/features/enquiries/pages/enquiries-page"),
  { ssr: false }
);

export default function EnquiriesPageClient() {
  return <EnquiriesPage />;
}
