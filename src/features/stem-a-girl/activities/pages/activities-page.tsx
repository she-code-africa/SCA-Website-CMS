// src/app/(dashboard)/stem-a-girl/activities/page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getSAGActivities } from "@/features/stem-a-girl/activities/api";
import type {
  SAGActivity,
  SAGActivitiesFilters
} from "@/features/stem-a-girl/activities/types";

import { ActivitiesFilters } from "@/features/stem-a-girl/activities/components/activities-filters";
import { ActivitiesTable } from "@/features/stem-a-girl/activities/components/activities-table";
import { MobileActivityCard } from "@/features/stem-a-girl/activities/components/mobile-activity-card";
import { MobileActivitySkeletonCard } from "@/features/stem-a-girl/activities/components/mobile-activity-skeleton-card";
import { ActivitySheet } from "@/features/stem-a-girl/activities/components/activity-sheet";

import { TeamPagination } from "@/features/team/components/team-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function ActivitiesPage() {
  const [filters, setFilters] = React.useState<SAGActivitiesFilters>({
    search: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<SAGActivity | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setSheetMode("create");
      setSheetOpen(true);
    };
    window.addEventListener("sag-activity:add", handler);
    return () => window.removeEventListener("sag-activity:add", handler);
  }, []);

  React.useEffect(() => setPage(1), [filters.search]);

  const query = useQuery({
    queryKey: ["sag-activities", filters],
    queryFn: () => getSAGActivities(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (a: SAGActivity) => {
    setSelected(a);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const openEdit = (a: SAGActivity) => {
    setSelected(a);
    setSheetMode("view"); // the sheet has an Edit button inside
    setSheetOpen(true);
  };

  return (
    <TableShell
      title="Activities"
      description="Manage Stem-A-Girl activities."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} activity(ies)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ActivitiesFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "" })}
          />

          <TeamPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        <div className="space-y-3">
          {/* Mobile */}
          <div className="grid gap-3 md:hidden">
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <MobileActivitySkeletonCard key={i} />
              ))
            ) : query.isError ? (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                Failed to load activities.
              </div>
            ) : paged.length ? (
              paged.map((a) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => openView(a)}
                  className="text-left w-full"
                >
                  <MobileActivityCard activity={a} />
                </button>
              ))
            ) : (
              <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                No activities found.
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <TableFrame>
              <ActivitiesTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onView={openView}
                onEdit={openEdit}
              />
            </TableFrame>
          </div>
        </div>

        <ActivitySheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          activityId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
