import PartnersPageClient from "@/features/partners/components/PartnersPageClient";

// 🚀 Force dynamic rendering – no static generation for this route
export const dynamic = "force-dynamic";

export default function Page() {
  return <PartnersPageClient />;
}
