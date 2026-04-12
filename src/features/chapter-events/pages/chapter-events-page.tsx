"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { Button } from "@/components/ui/button";
import { getChapterEvents } from "@/features/chapters/api";
import type { ChapterEvent } from "@/features/chapters/types";

import { ChapterSelect } from "@/features/chapters/components/chapter-select";
import { ChapterEventTable } from "@/features/chapter-events/components/chapter-event-table";
import { MobileChapterEventCard } from "@/features/chapter-events/components/mobile-chapter-event-card";
import { ChapterEventSheet } from "@/features/chapter-events/components/chapter-event-sheet";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

const STORAGE_KEY = "selectedChapterId-events";

export default function ChapterEventsPage() {
  const [selectedChapterId, setSelectedChapterId] = React.useState("");
  const [selectedChapterName, setSelectedChapterName] = React.useState("");

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selectedEventId, setSelectedEventId] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { chapterId, chapterName } = JSON.parse(saved);
        if (chapterId) {
          setSelectedChapterId(chapterId);
          setSelectedChapterName(chapterName || "");
        }
      } catch (e) {
        console.error("Failed to parse saved chapter:", e);
      }
    }
  }, []);

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ chapterId, chapterName: "" })
      );
    }
  };

  const {
    data: events = [],
    isLoading,
    isError,
    isFetching
  } = useQuery({
    queryKey: ["chapter-events", selectedChapterId],
    queryFn: () => getChapterEvents(selectedChapterId),
    enabled: !!selectedChapterId,
    staleTime: 30_000
  });

  const openCreate = () => {
    setSelectedEventId(undefined);
    setSheetMode("create");
    setSheetOpen(true);
  };

  const openView = (ev: ChapterEvent) => {
    setSelectedEventId(ev._id);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const subtitle = selectedChapterId
    ? `Events for ${selectedChapterName || "selected chapter"}.`
    : "Select a chapter to view and manage events.";

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_EVENT}>
      <TableShell
        title="Chapter Events"
        description={subtitle}
        right={
          <div className="text-sm text-muted-foreground">
            {!selectedChapterId
              ? "No chapter selected"
              : isLoading
                ? "Loading…"
                : `${events.length} event(s)`}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <ChapterSelect
                value={selectedChapterId}
                onValueChange={handleChapterChange}
                placeholder="Select a chapter"
              />

              <PermissionGate permission={PERMISSIONS.CREATE_EVENT}>
                <Button
                  className="w-full sm:w-auto"
                  onClick={openCreate}
                  disabled={!selectedChapterId}
                >
                  Add Event
                </Button>
              </PermissionGate>
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedChapterId ? (isFetching ? "Refreshing…" : " ") : " "}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-12 space-y-3">
              <div className="grid gap-3 md:hidden">
                {!selectedChapterId ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                    Please select a chapter to view its events.
                  </div>
                ) : isLoading ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                    Loading events…
                  </div>
                ) : isError ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                    Failed to load events.
                  </div>
                ) : events.length ? (
                  events.map((event) => (
                    <button
                      key={event._id}
                      type="button"
                      onClick={() => openView(event)}
                      className="text-left w-full"
                    >
                      <MobileChapterEventCard event={event} />
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border bg-background p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      There are no events for this chapter.
                    </p>
                    <PermissionGate permission={PERMISSIONS.CREATE_EVENT}>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={openCreate}
                      >
                        Add First Event
                      </Button>
                    </PermissionGate>
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                {!selectedChapterId ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                    Please select a chapter to view its events.
                  </div>
                ) : (
                  <TableFrame>
                    <ChapterEventTable
                      rows={events}
                      isLoading={isLoading}
                      isError={isError}
                      onRowClick={openView}
                    />
                  </TableFrame>
                )}
              </div>
            </div>
          </div>

          <ChapterEventSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            mode={sheetMode}
            eventId={selectedEventId}
            chapterId={selectedChapterId}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
