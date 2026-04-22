// src/app/admin/stem-a-girl/impact-stories/page.tsx

"use client";
import dynamic from "next/dynamic";

const ImpactStoriesPageClient = dynamic(
  () =>
    import("@/features/stem-a-girl/impact-stories/pages/impact-stories-page"),
  { ssr: false }
);

export default function Page() {
  return <ImpactStoriesPageClient />;
}
