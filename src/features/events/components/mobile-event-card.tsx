// src/features/events/components/mobile-event-card.tsx
import { format } from "date-fns";
import { Calendar, ExternalLink } from "lucide-react";
import type { Event } from "@/features/events/types";
import { Badge } from "@/components/ui/badge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateVariant(state?: string) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary"; // draft
}

export function MobileEventCard({ event }: { event: Event }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            className="h-16 w-16 rounded-lg object-cover border"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{event.title ?? "—"}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {event.description ?? "—"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={stateVariant(event.state)}>
              {event.state ?? "draft"}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {fmtDate(event.eventDate)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs">
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">Event Link</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(event.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
