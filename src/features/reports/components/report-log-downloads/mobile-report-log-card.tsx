import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ReportDownloadUser } from "@/features/reports/types";
import { cleanName, getInitials } from "@/features/reports/utils";

export function MobileReportLogCard({ user }: { user: ReportDownloadUser }) {
  const first = cleanName(user.firstname);
  const last = cleanName(user.lastname);
  const fullName = [first, last].filter(Boolean).join(" ") || "—";

  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs font-medium">
            {getInitials(user.firstname, user.lastname)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fullName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.email ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
