"use client";

import * as React from "react";
import { format } from "date-fns";
import type { Media } from "@/features/media/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Image, Video, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MobileMediaCard } from "./mobile-media-card";
import { MobileMediaSkeletonCard } from "./mobile-media-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function getTypeIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "video":
      return <Video className="w-4 h-4 text-muted-foreground" />;
    case "image":
      return <Image className="w-4 h-4 text-muted-foreground" />;
    case "blog":
      return <FileText className="w-4 h-4 text-muted-foreground" />;
    default:
      return <FileText className="w-4 h-4 text-muted-foreground" />;
  }
}

export function MediaTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: Media[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (media: Media) => void;
}) {
  const headers = ["Cover", "Title", "Description", "Type", "Author", "Published"];

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileMediaSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load media.
          </div>
        ) : rows.length ? (
          rows.map((media) => (
            <button
              key={media._id}
              type="button"
              onClick={() => onRowClick(media)}
              className="text-left w-full"
            >
              <MobileMediaCard media={media} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            No media found.
          </div>
        )}
      </div>

      {/* Tablet + Desktop table */}
      <div className="hidden md:block">
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
                        <TableCell key={cIdx} className="whitespace-nowrap">
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
                      Failed to load media.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((media) => {
                    return (
                      <TableRow
                        key={media._id}
                        onClick={() => onRowClick(media)}
                        className={cn("cursor-pointer hover:bg-muted/50")}
                      >
                        <TableCell className="whitespace-nowrap">
                          {media.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={media.coverImage}
                              alt={media.title}
                              className="h-12 w-12 rounded-lg object-cover border"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border">
                              {getTypeIcon(media.type)}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="whitespace-nowrap font-medium">
                          {media.title ?? "—"}
                        </TableCell>

                        <TableCell className="max-w-md">
                          <div className="truncate">
                            {media.description ?? "—"}
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          <Badge variant="secondary" className="capitalize">
                            {media.type ?? "—"}
                          </Badge>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {media.author ?? "—"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {fmtDate(media.dateCreated)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={headers.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No media found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}