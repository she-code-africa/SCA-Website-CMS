// src/features/chapters/components/chapter-lead-table.tsx
"use client";

import * as React from "react";
import type { ChapterLead } from "@/features/chapters/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { MobileChapterLeadCard } from "./mobile-chapter-lead-card";
import { MobileChapterLeadSkeletonCard } from "./mobile-chapter-lead-skeleton-card";

function getInitials(name: string): string {
  return (name || "—")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ChapterLeadTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: ChapterLead[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (lead: ChapterLead) => void;
}) {
  const headers = ["Name", "Role", "Social Links"];

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileChapterLeadSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load leads.
          </div>
        ) : rows.length ? (
          rows.map((lead) => (
            <button
              key={lead._id}
              type="button"
              onClick={() => onRowClick(lead)}
              className="text-left w-full"
            >
              <MobileChapterLeadCard lead={lead} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            There are no leads for this chapter.
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
                      Failed to load leads.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((lead) => {
                    const socials = lead.socialMediaLinks || {};
                    const socialCount = Object.keys(socials).length;

                    return (
                      <TableRow
                        key={lead._id}
                        onClick={() => onRowClick(lead)}
                        className={cn("cursor-pointer hover:bg-muted/50")}
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {lead.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={lead.image}
                                alt={lead.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                {getInitials(lead.name)}
                              </div>
                            )}
                            <span className="font-medium">
                              {lead.name ?? "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {lead.role ?? "—"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {socialCount ? `${socialCount} link(s)` : "—"}
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
                      There are no leads for this chapter.
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
