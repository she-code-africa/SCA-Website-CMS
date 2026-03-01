import { format } from "date-fns";
import type { AdminUser } from "@/features/users/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function initials(user: AdminUser) {
  const a = user.firstName?.[0] ?? "";
  const b = user.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" }
};

export function MobileUserCard({ user }: { user: AdminUser }) {
  const st = statusConfig[user.status] ?? {
    label: user.status,
    variant: "outline" as const
  };
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
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
            <Badge variant={st.variant} className="shrink-0 text-xs">
              {st.label}
            </Badge>
          </div>

          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {user.role.name}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Last login</span>
          <span>{fmtDate(user.lastLogin)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Joined</span>
          <span>{fmtDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
