import { DeclineInvitePage } from "@/features/auth/components/decline-invite-page";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function DeclinePage({ params }: PageProps) {
  const { token } = await params;
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <DeclineInvitePage token={token} />
    </main>
  );
}
