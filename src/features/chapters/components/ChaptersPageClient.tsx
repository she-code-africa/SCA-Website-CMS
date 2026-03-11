"use client";

import dynamic from "next/dynamic";

const ChapterPage = dynamic(
  () => import("@/features/chapters/pages/chapters-page"),
  { ssr: false }
);

export default function ChaptersPageClient() {
  return <ChapterPage />;
}
