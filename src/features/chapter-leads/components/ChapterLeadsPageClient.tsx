"use client";

import dynamic from "next/dynamic";

const ChapterLead = dynamic(
  () => import("@/features/chapter-leads/pages/chapter-leads-page"),
  { ssr: false }
);

export default function ChapterLeadClient() {
  return <ChapterLead />;
}
