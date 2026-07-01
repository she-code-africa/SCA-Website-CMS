// src/features/stem-a-girl/impact-stories/components/impact-stories-table.tsx

"use client";

import * as React from "react";
import { Eye, Pencil } from "lucide-react";
import type { ImpactStory } from "../types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { fmtDate, getInitials, getSchoolName } from "../utils";

function stateBadge(state?: string) {
  if (state === "published")
    return <Badge className="bg-green-600">Published</Badge>;
  if (state === "archived")
    return <Badge variant="destructive">Archived</Badge>;
  return <Badge variant="secondary">Draft</Badge>;
}

export function ImpactStoriesTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit,
  schoolMap
}: {
  rows: ImpactStory[];
  isLoading: boolean;
  isError: boolean;
  onView: (s: ImpactStory) => void;
  onEdit: (s: ImpactStory) => void;
  schoolMap: Map<string, string>;
}) {
  const headers = [
    "Name",
    "School",
    "Story",
    "State",
    "Updated",
    "Created",
    "Action"
  ];

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead key={h} className="whitespace-nowrap">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow key={idx}>
                  {headers.map((_, cIdx) => (
                    <TableCell key={cIdx}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-red-500"
                >
                  Failed to load impact stories.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No impact stories found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((story) => (
                <TableRow
                  key={story._id}
                  onClick={() => onView(story)}
                  className={cn("cursor-pointer hover:bg-muted/50")}
                >
                  <TableCell className="whitespace-normal min-w-[200px]">
                    <div className="flex items-center gap-2">
                      {story.image ? (
                        <img
                          src={story.image}
                          alt={story.name}
                          className="h-8 w-8 rounded-full object-cover border shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                          {getInitials(story.name)}
                        </div>
                      )}
                      <span className="font-medium">
                        {story.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getSchoolName(story, schoolMap)}
                  </TableCell>
                  <TableCell className=" line-clamp-3">
                    {story.story}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {stateBadge(story.state)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(story.updatedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(story.createdAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(story)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(story)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
