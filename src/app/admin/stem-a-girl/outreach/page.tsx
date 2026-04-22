// src/app/admin/stem-a-girl/outreach/page.tsx

"use client";
import dynamic from "next/dynamic";

const OutreachPageClient = dynamic(
  () => import("@/features/stem-a-girl/outreach/pages/outreach-page"),
  { ssr: false }
);

export default function Page() {
  return <OutreachPageClient />;
}
