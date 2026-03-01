// src/app/admin/events/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getEvents } from "@/features/events/api";
import type { Event, EventFilters } from "@/features/events/types";

import { EventFilters as Filters } from "@/features/events/components/event-filters";
import { EventTable } from "@/features/events/components/event-table";
import { MobileEventCard } from "@/features/events/components/mobile-event-card";
import { MobileEventSkeletonCard } from "@/features/events/components/mobile-event-skeleton-card";
import { EventSheet } from "@/features/events/components/event-sheet";
import { EventPagination } from "@/features/events/components/event-pagination";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: Event[], f: EventFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((e) => {
      return e.title?.toLowerCase().includes(q);
    });
  }

  if (f.state && f.state !== "") out = out.filter((e) => e.state === f.state);

  if (f.sortBy && f.sortBy !== "") {
    const key = f.sortBy;
    out.sort((a: any, b: any) => {
      const av = a?.[key];
      const bv = b?.[key];

      if (key === "createdAt" || key === "updatedAt" || key === "eventDate") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    out.sort(
      (a, b) =>
        new Date(b.eventDate ?? 0).getTime() -
        new Date(a.eventDate ?? 0).getTime()
    );
  }

  return out;
}

export default function EventsPage() {
  const [filters, setFilters] = React.useState<EventFilters>({
    search: "",
    state: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Event | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("event:add", handler);
    return () => window.removeEventListener("event:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.sortBy]);

  const query = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Event[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (e: Event) => {
    setSelected(e);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Events"
      description="Manage events, publish/archive status, and event dates."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} event(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", state: "", sortBy: "" })}
          />

          <EventPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-12 space-y-3">
            <div className="grid gap-3 md:hidden">
              {query.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MobileEventSkeletonCard key={i} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load events.
                </div>
              ) : paged.length ? (
                paged.map((e) => (
                  <button
                    key={e._id}
                    type="button"
                    onClick={() => openView(e)}
                    className="text-left w-full"
                  >
                    <MobileEventCard event={e} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No events found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <EventTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>
        </div>

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
