// src/features/stem-a-girl/consent/components/consent-badges.tsx

import { Badge } from "@/components/ui/badge";
import type { AccountStatus, ConsentStatus } from "../types";

export function ConsentStateBadge({ state }: { state: ConsentStatus }) {
  if (state === "Approved") return <Badge className="bg-green-600">Approved</Badge>;
  if (state === "Pending") return <Badge className="bg-amber-500">Pending</Badge>;
  return <Badge variant="destructive">Deactivated</Badge>;
}

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  if (status === "Active") {
    return (
      <Badge variant="outline" className="border-green-600 text-green-700">
        Active
      </Badge>
    );
  }
  return <Badge variant="secondary">Inactive</Badge>;
}
