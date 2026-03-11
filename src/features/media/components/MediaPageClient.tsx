"use client";

import dynamic from "next/dynamic";

const MediaPage = dynamic(
  () => import("@/features/media/pages/media-page"),
  { ssr: false }
);

export default function MediaPageClient() {
  return <MediaPage />;
}
