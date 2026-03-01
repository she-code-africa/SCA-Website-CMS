"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getSagActivities, getSagEvents } from "@/features/stem-a-girl/sag-events/api";
import type { SagEvent, SagEventsFilters } from "@/features/stem-a-girl/sag-events/types";

import { EventsFilters } from "@/features/stem-a-girl/sag-events/components/events-filters";
import { EventsTable } from "@/features/stem-a-girl/sag-events/components/events-table";
import { EventPagination } from "@/features/stem-a-girl/sag-events/components/event-pagination";
import { EventSheet } from "@/features/stem-a-girl/sag-events/components/event-sheet";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function SagEventsPage() {
  const [filters, setFilters] = React.useState<SagEventsFilters>({
    search: "",
    state: "",
    activity: ""
  });

  // client-side pagination (same as Team)
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<SagEvent | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("sag-events:add", handler);
    return () => window.removeEventListener("sag-events:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.activity]);

  const activitiesQuery = useQuery({
    queryKey: ["sag-activities"],
    queryFn: getSagActivities,
    staleTime: 60_000
  });

  const eventsQuery = useQuery({
    queryKey: ["sag-events", filters],
    queryFn: () => getSagEvents(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => eventsQuery.data ?? [], [eventsQuery.data]);

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (e: SagEvent) => {
    setSelected(e);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Events"
      description="Manage Stem-a-girl events."
      right={
        <div className="text-sm text-muted-foreground">
          {eventsQuery.isLoading ? "Loading…" : `${rows.length} event(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Controls row (same pattern as Team) */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <EventsFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", state: "", activity: "" })}
            activities={activitiesQuery.data ?? []}
            activitiesLoading={activitiesQuery.isLoading}
          />

          <EventPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={eventsQuery.isFetching}
          />
        </div>

        {/* Responsive wrapper (same pattern as Team) */}
        <div className="hidden md:block">
          <TableFrame>
            <EventsTable
              rows={paged}
              isLoading={eventsQuery.isLoading}
              isError={eventsQuery.isError}
              onRowClick={openView}
            />
          </TableFrame>
        </div>

        {/* Mobile list is inside EventsTable itself (like your TeamTable), but
            you can also keep it in-page. Current setup already supports mobile. */}

        <EventSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          eventId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
