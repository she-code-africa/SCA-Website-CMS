"use client";

import dynamic from "next/dynamic";

const ChapterEventPage = dynamic(
  () => import("@/features/chapter-events/pages/chapter-events-page"),
  { ssr: false }
);

export default function ChapterEventClient() {
  return <ChapterEventPage />;
}
