"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import type { TeamMember } from "@/features/team/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MobileTeamCard } from "./mobile-team-card";
import { MobileTeamSkeletonCard } from "./mobile-team-skeleton-card";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function TeamTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: TeamMember[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (m: TeamMember) => void;
}) {
  const headers = ["Name", "Team Lead", "Team", "Role", "Updated", "Created", "View"];

  return (
    <div className="space-y-3">
      {/* Mobile list */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MobileTeamSkeletonCard key={i} />
          ))
        ) : isError ? (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
            Failed to load team members.
          </div>
        ) : rows.length ? (
          rows.map((m) => (
            <button
              key={m._id}
              type="button"
              onClick={() => onRowClick(m)}
              className="text-left w-full"
            >
              <MobileTeamCard member={m} />
            </button>
          ))
        ) : (
          <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
            No team members found.
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
                      Failed to load team members.
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((m) => {
                    const teamName =
                      typeof m.teamCategory === "string"
                        ? m.teamCategory
                        : (m.teamCategory?.name ?? "—");

                    return (
                      <TableRow
                        key={m._id}
                        onClick={() => onRowClick(m)}
                        className={cn("cursor-pointer hover:bg-muted/50")}
                      >
                        {/* Name column */}
                        <TableCell className="wrap-break-word min-w-45">
                          <div className="flex items-center gap-2">
                            {m.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.image}
                                alt={m.name}
                                className="h-8 w-8 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                            )}
                            <span className="font-medium wrap-break-word">
                              {m.name ?? "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {m.isLeader ? "Yes" : "No"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {teamName}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {m.role ?? "—"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {fmtDate(m.updatedAt)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {fmtDate(m.createdAt)}
                        </TableCell>

                        {/* View action column */}
                        <TableCell className="whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick(m);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
                      No team members found.
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