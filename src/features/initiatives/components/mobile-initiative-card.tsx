// src/features/initiatives/components/mobile-initiative-card.tsx
import { format } from "date-fns";
import { ExternalLink, Lightbulb } from "lucide-react";
import type { Initiative } from "@/features/initiatives/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stripHtml(html: string) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function MobileInitiativeCard({
  initiative
}: {
  initiative: Initiative;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {initiative.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initiative.image}
            alt={initiative.title}
            className="h-16 w-16 rounded-lg object-cover border"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {initiative.title ?? "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {stripHtml(initiative.description ?? "—")}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={initiative.isAvailable ? "default" : "secondary"}>
              {initiative.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        {initiative.initiative_url && (
          <a
            href={initiative.initiative_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">Initiative Link</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(initiative.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}