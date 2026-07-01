"use client";

import dynamic from "next/dynamic";

const SchoolProgram = dynamic(
  () => import("@/features/school-programs/pages/school-programs-page"),
  { ssr: false }
);

export default function SchoolProgramsPageClient() {
  return <SchoolProgram />;
}
