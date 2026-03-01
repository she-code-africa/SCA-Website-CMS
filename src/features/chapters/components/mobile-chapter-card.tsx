// src/features/chapters/components/mobile-chapter-card.tsx
import { format } from "date-fns";
import { MapPin, Users } from "lucide-react";
import type { Chapter } from "@/features/chapters/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

function getCategoryName(category: any): string {
  if (!category) return "—";
  if (typeof category === "string") return category;
  return category.name ?? "—";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MobileChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={chapter.image || undefined} alt={chapter.name} />
            <AvatarFallback>{getInitials(chapter.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {chapter.name ?? "—"}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {chapter.city}, {chapter.country}
              </span>
            </div>
          </div>

          <Badge variant={stateVariant(chapter.state)}>
            {chapter.state ?? "draft"}
          </Badge>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 text-xs">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Category:</span>
          <span className="font-medium">
            {getCategoryName(chapter.category)}
          </span>
        </div>

        {/* Dates */}
        <div className="grid gap-2 text-xs pt-2 border-t">
          {chapter.leader && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Leader</span>
              <span className="truncate ml-2">{chapter.leader}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Updated</span>
            <span>{fmtDate(chapter.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
