//src/app/(auth)/invite/[token]/page.tsx
import { InviteAcceptanceForm } from "@/features/auth/components/invite-acceptance-form";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InviteAcceptancePage({ params }: PageProps) {
  const { token } = await params;

  // Removed 'bg-slate-950' to ensure it inherits the same background as Login
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <InviteAcceptanceForm token={token} />
    </main>
  );
}
