// src/features/volunteer-roles/components/volunteer-role-table.tsx
"use client";

import * as React from "react";
import type { VolunteerRole } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Image as ImageIcon } from "lucide-react";

function chip(s: string) {
  return (
    <span
      key={s}
      className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
    >
      {s}
    </span>
  );
}

// Safe truncation that DOES NOT depend on Tailwind line-clamp plugin
function truncateText(text?: string, max = 90) {
  const v = (text ?? "").trim();
  if (!v) return "—";
  if (v.length <= max) return v;
  return v.slice(0, max).trimEnd() + "…";
}

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="rounded-2xl border bg-muted/20 p-4">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">No volunteer roles yet</p>
        <p className="text-sm text-muted-foreground">
          Create a role to show volunteer opportunities on the website.
        </p>
      </div>
    </div>
  );
}

export function VolunteerRoleTable({
  rows,
  isLoading,
  isError,
  onRowClick
}: {
  rows: VolunteerRole[];
  isLoading: boolean;
  isError: boolean;
  onRowClick: (r: VolunteerRole) => void;
}) {
  const headers = ["Role", "Skills", "Updated"];

  return (
    <TooltipProvider delayDuration={120}>
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
                {/* Role cell skeleton: image circle + text */}
                <TableCell className="min-w-90">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-105 max-w-[60vw]" />
                    </div>
                  </div>
                </TableCell>

                {/* Skills skeleton */}
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </TableCell>

                {/* Updated skeleton */}
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="h-24 text-center text-red-500"
              >
                Failed to load volunteer roles.
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((r) => (
              <TableRow
                key={r._id}
                onClick={() => onRowClick(r)}
                className={cn("cursor-pointer hover:bg-muted/50")}
              >
                {/* ROLE + IMAGE */}
                <TableCell className="min-w-90">
                  <div className="flex items-center gap-3">
                    {r.image ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.image}
                            alt={r.name}
                            className="h-8 w-8 rounded-full object-cover"
                            onClick={(e) => {
                              // prevent row click if user only wants to hover/click image
                              e.stopPropagation();
                            }}
                          />
                        </TooltipTrigger>

                        <TooltipContent className="p-2">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={r.image}
                              alt={`${r.name} preview`}
                              className="h-24 w-24 rounded-xl object-cover border"
                            />
                            <div className="max-w-60">
                              <p className="text-sm font-medium">{r.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Hover preview
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted" />
                    )}

                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {r.name ?? "—"}
                      </div>

                      {/* 🔥 Hard truncate (no plugin required) */}
                      <div
                        className="text-xs text-muted-foreground truncate max-w-130"
                        title={(r.description ?? "").trim() || undefined}
                      >
                        {truncateText(r.description, 90)}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* SKILLS */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(r.skills ?? []).slice(0, 3).map((s) => chip(s))}
                    {(r.skills ?? []).length > 3
                      ? chip(`+${r.skills.length - 3}`)
                      : null}
                  </div>
                </TableCell>

                {/* UPDATED */}
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {fmtDate(r.updatedAt ?? r.createdAt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="p-0">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
