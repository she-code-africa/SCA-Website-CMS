"use client";

import dynamic from "next/dynamic";

const ReachPage = dynamic(
  () => import("@/features/our-reach/pages/reach-page"),
  { ssr: false }
);

export default function ReachPageClient() {
  return <ReachPage />;
}
