import { format } from "date-fns";
import type { TeamMember } from "@/features/team/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function teamName(member: TeamMember) {
  return typeof member.teamCategory === "string"
    ? member.teamCategory
    : (member.teamCategory?.name ?? "—");
}

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

export function MobileTeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {member.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image}
            alt={member.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-center justify-center text-xs font-semibold">
            {initials(member.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{member.name ?? "—"}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {teamName(member)} • {member.role ?? "—"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {member.isLeader ? "Lead" : "Member"}
            </Badge>
            {member.state ? (
              <Badge variant="outline">{String(member.state)}</Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(member.updatedAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(member.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
