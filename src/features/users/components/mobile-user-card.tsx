// src/features/users/components/mobile-user-card.tsx
"use client";

import { format } from "date-fns";
import type { AdminUser } from "@/features/users/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(user: AdminUser) {
  const a = user.firstName?.[0] ?? "";
  const b = user.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

// Same status badge logic as UserTable
function getStatusBadge(user: AdminUser) {
  if (user.status === "pending") {
    return <Badge variant="outline">Pending</Badge>;
  }
  const isActive = user.isActive ?? user.status === "active";
  if (isActive) {
    return (
      <Badge className="bg-green-600 text-white hover:bg-green-700">
        Active
      </Badge>
    );
  }
  return (
    <Badge
      variant="destructive"
      className="bg-red-600 text-white hover:bg-red-700"
    >
      Deactivated
    </Badge>
  );
}

type Props = {
  user: AdminUser;
  roles: any[];
  onClick?: () => void;
};

export function MobileUserCard({ user, roles, onClick }: Props) {
  const resolveRoleName = () => {
    const roleValue = user.role || (Array.isArray(user.role) ? user.role[0] : null);
    if (!roleValue) return "User";
    if (typeof roleValue === "object") return roleValue.name || "User";
    if (roleValue === "ADMINISTRATOR") return "Super Admin";
    const matchedRole = roles.find(
      (r) => r._id === roleValue || r.id === roleValue
    );
    return matchedRole?.name || (roleValue.length > 20 ? `ID: ${roleValue.substring(0, 6)}` : roleValue);
  };

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div
      className={cn(
        "rounded-xl border bg-background p-4 shadow-sm transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
          {initials(user)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fullName}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            {getStatusBadge(user)}
          </div>

          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {resolveRoleName()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-1.5 text-xs">
        {/* <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Last login</span>
          <span>{fmtDate(user.lastLogin)}</span>
        </div> */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Joined</span>
          <span>{fmtDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}