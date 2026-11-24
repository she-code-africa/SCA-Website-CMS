// src/features/stem-a-girl/participants/components/participants-table.tsx

"use client";

import * as React from "react";
import type { Participant } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtDate } from "@/features/stem-a-girl/shared/format";
import {
  CompletedTag,
  CompletionBar,
  ParticipantStatusBadge,
} from "./participant-parts";

const headers = [
  "Name",
  "Email",
  "Course",
  "Age",
  "Country",
  "Status",
  "Enrolled",
  "Completion",
];

export function ParticipantsTable({
  rows,
  isLoading,
  isError,
}: {
  rows: Participant[];
  isLoading: boolean;
  isError: boolean;
}) {
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
                  Failed to load participants.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No participants found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {p.name}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {p.email}
                  </TableCell>

                  {/* Current course, plus any course they already finished */}
                  <TableCell className="whitespace-nowrap">
                    <div className="grid gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{p.course}</span>
                        {p.status === "Completed" && <CompletedTag />}
                      </div>
                      {p.completedCourse && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{p.completedCourse}</span>
                          <CompletedTag
                            title={`Completed on ${fmtDate(p.completedCourseDate)}`}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">{p.age}</TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {p.country}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <ParticipantStatusBadge status={p.status} />
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {fmtDate(p.enrolledDate)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <CompletionBar value={p.completion} />
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
