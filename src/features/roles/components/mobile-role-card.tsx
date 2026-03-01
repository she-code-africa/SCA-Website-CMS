import type { RoleDetail } from "@/features/roles/types";
import { Badge } from "@/components/ui/badge";

export function MobileRoleCard({ role }: { role: RoleDetail }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{role.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {role.description || "No description."}
          </p>
        </div>
        <Badge
          variant={role.isDefault ? "secondary" : "outline"}
          className="shrink-0 text-xs"
        >
          {role.isDefault ? "System" : "Custom"}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{role.permissions.length} permissions</span>
        <span>
          {role.usersCount} user{role.usersCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
