"use client";

import dynamic from "next/dynamic";

const UserPage = dynamic(
  () => import("@/features/users/pages/users-page"),
  { ssr: false }
);

export default function UserPageClient() {
  return <UserPage />;
}
