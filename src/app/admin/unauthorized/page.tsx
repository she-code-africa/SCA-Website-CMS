// app/admin/unauthorized/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground mt-2">
        You don&apos;t have permission to view this page.
      </p>
      <Button asChild className="mt-6">
        <Link href="/admin/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
