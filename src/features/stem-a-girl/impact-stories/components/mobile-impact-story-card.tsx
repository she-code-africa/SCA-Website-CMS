// src/features/stem-a-girl/impact-stories/components/mobile-impact-story-card.tsx

"use client";

import type { ImpactStory } from "../types";
import { Badge } from "@/components/ui/badge";
import { fmtDate, getInitials, getSchoolName } from "../utils";

export function MobileImpactStoryCard({
  story,
  schoolMap
}: {
  story: ImpactStory;
  schoolMap: Map<string, string>;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        {story.image ? (
          <img
            src={story.image}
            alt={story.name}
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border bg-muted flex items-start justify-center text-xs font-semibold">
            {getInitials(story.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{story.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {story.story}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge
              variant={story.state === "published" ? "default" : "secondary"}
            >
              {story.state ?? "draft"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {getSchoolName(story, schoolMap)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Updated</span>
          <span>{fmtDate(story.updatedAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created</span>
          <span>{fmtDate(story.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
