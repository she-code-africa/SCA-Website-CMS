"use client";

import * as React from "react";
import { format } from "date-fns";
import { Briefcase, Eye, Pencil } from "lucide-react";
import type { Job } from "@/features/jobs/types";
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

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

function stateBadgeVariant(state?: string) {
  if (state === "published") return "default";
  if (state === "archived") return "destructive";
  return "secondary"; // draft
}

export function JobTable({
  rows,
  isLoading,
  isError,
  onView,
  onEdit
}: {
  rows: Job[];
  isLoading: boolean;
  isError: boolean;
  onView: (j: Job) => void;
  onEdit: (j: Job) => void;
}) {
  const headers = [
    "Job title",
    "Company",
    "Location",
    "Deadline",
    "State",
    "Created",
    "Action"
  ];

  const handleRowClick = (job: Job) => {
    onView(job);
  };

  return (
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
              Failed to load jobs.
            </TableCell>
          </TableRow>
        ) : rows.length ? (
          rows.map((j) => (
            <TableRow
              key={j._id}
              onClick={() => handleRowClick(j)}
              className={cn("cursor-pointer hover:bg-muted/50")}
            >
              {/* Job title */}
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{j.title ?? "—"}</span>
                </div>
              </TableCell>

              {/* Company */}
              <TableCell className="whitespace-nowrap">
                {j.company?.companyName ?? "—"}
              </TableCell>

              {/* Location */}
              <TableCell className="whitespace-nowrap">
                {j.location ?? "—"}
              </TableCell>

              {/* Deadline */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(j.deadline)}
              </TableCell>

              {/* State */}
              <TableCell className="whitespace-nowrap">
                <Badge variant={stateBadgeVariant(j.state)}>
                  {j.state ?? "draft"}
                </Badge>
              </TableCell>

              {/* Created */}
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {fmtDate(j.createdAt)}
              </TableCell>

              {/* Action */}
              <TableCell
                className="whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(j)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(j)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="h-24 text-center text-muted-foreground"
            >
              No jobs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
