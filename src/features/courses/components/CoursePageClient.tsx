"use client";

import dynamic from "next/dynamic";

const CoursesPage = dynamic(
  () => import("@/features/courses/pages/courses-page"),
  { ssr: false }
);

export default function CoursePageClient() {
  return <CoursesPage />;
}
