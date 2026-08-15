"use client";

import dynamic from "next/dynamic";

const RolePage = dynamic(() => import("@/features/roles/pages/roles-page"), {
  ssr: false,
});

export default function RolesPageClient() {
  return <RolePage />;
}
