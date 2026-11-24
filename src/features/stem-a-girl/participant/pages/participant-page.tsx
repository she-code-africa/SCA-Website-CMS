// src/features/stem-a-girl/participants/pages/participant-page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";
import { TablePagination } from "@/features/stem-a-girl/shared/table-pagination";
import { downloadCsv, fmtDate } from "@/features/stem-a-girl/shared/format";
import { getParticipants } from "../api";
import { DEFAULT_PARTICIPANT_FILTERS } from "../types";
import type { ParticipantFilters } from "../types";
import { applyParticipantFilters } from "../utils";
import { ParticipantFilterBar } from "../components/participant-filter-bar";
import { ParticipantsTable } from "../components/participants-table";
import {
  MobileParticipantCard,
  MobileParticipantSkeletonCard,
} from "../components/mobile-participant-card";

const PAGE_SIZE = 10;

export default function ParticipantPage() {
  const [filters, setFilters] = React.useState<ParticipantFilters>(
    DEFAULT_PARTICIPANT_FILTERS,
  );
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["participants"],
    queryFn: getParticipants,
    staleTime: 30_000,
  });

  const participants = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );
  const filtered = React.useMemo(
    () => applyParticipantFilters(participants, filters),
    [participants, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changeFilters = (next: ParticipantFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleExport = () => {
    downloadCsv(
      "shecode_participants.csv",
      [
        "Name",
        "Email",
        "Current Enrolled Course",
        "Prior Completed Course",
        "Age",
        "Country",
        "Status",
        "Enrolled Date",
        "Completion %",
      ],
      filtered.map((p) => [
        p.name,
        p.email,
        p.course,
        p.completedCourse ?? "None",
        p.age,
        p.country,
        p.status,
        fmtDate(p.enrolledDate),
        `${p.completion}%`,
      ]),
    );
    toast.success(`Exported ${filtered.length} participant(s)`);
  };

  return (
    <TableShell
      title="Participants"
      description="Manage and track registered learners across STEM programmes."
      right={
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} participant(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <ParticipantFilterBar
            value={filters}
            onChange={changeFilters}
            onReset={() => changeFilters(DEFAULT_PARTICIPANT_FILTERS)}
            onExport={handleExport}
            exportDisabled={isLoading || filtered.length === 0}
          />
        </div>
        <div className="flex justify-end">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setPage(Math.max(1, currentPage - 1))}
            onNext={() => setPage(Math.min(totalPages, currentPage + 1))}
            isLoading={isLoading}
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-3 md:hidden">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileParticipantSkeletonCard key={i} />
            ))
          ) : isError ? (
            <div className="text-center text-red-500">
              Failed to load participants
            </div>
          ) : paged.length ? (
            paged.map((p) => <MobileParticipantCard key={p._id} participant={p} />)
          ) : (
            <div className="text-center text-muted-foreground">
              No participants found
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TableFrame>
            <ParticipantsTable
              rows={paged}
              isLoading={isLoading}
              isError={isError}
            />
          </TableFrame>
        </div>
      </div>
    </TableShell>
  );
}
