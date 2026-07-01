"use client";

import dynamic from "next/dynamic";

const TestimonialsPage = dynamic(
  () => import("@/features/testimonials/pages/testimonials-page"),
  { ssr: false }
);

export default function TestimonialsPageClient() {
  return <TestimonialsPage />;
}
