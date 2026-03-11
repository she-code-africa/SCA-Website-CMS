import ReportsPageClient from "@/features/reports/components/ReportsPageClient";

// 🚀 Force dynamic rendering – no static generation for this route
export const dynamic = "force-dynamic";

export default function Page() {
  return <ReportsPageClient />;
}
