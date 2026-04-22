// src/app/admin/stem-a-girl/enquiries/page.tsx

"use client";
import dynamic from "next/dynamic";

const StemEnquiriesPageClient = dynamic(
  () => import("@/features/stem-a-girl/enquiries/pages/stem-enquiries-page"),
  { ssr: false }
);

export default function Page() {
  return <StemEnquiriesPageClient />;
}
