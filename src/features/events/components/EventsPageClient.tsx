"use client";

import dynamic from "next/dynamic";

const EventPage = dynamic(
  () => import("@/features/events/pages/events-page"),
  { ssr: false }
);

export default function EventPageClient() {
  return <EventPage />;
}
