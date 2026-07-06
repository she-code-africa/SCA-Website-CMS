"use client";

import dynamic from "next/dynamic";

const CoursesPage = dynamic(
  () => import("@/features/stem-a-girl/courses/pages/courses-page"),
  { ssr: false },
);

export default function CoursesPageClient() {
  return <CoursesPage />;
}
