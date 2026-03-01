// src/app/admin/chapters/leads/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getChapterLeads } from "@/features/chapters/api";
import type { ChapterLead } from "@/features/chapters/types";

import { ChapterSelect } from "@/features/chapters/components/chapter-select";
import { ChapterLeadTable } from "@/features/chapter-leads/components/chapter-lead-table";
import { MobileChapterLeadCard } from "@/features/chapter-leads/components/mobile-chapter-lead-card";
import { ChapterLeadSheet } from "@/features/chapter-leads/components/chapter-lead-sheet";

import { Button } from "@/components/ui/button";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

const STORAGE_KEY = "selectedChapterId-leads";

export default function ChapterLeadsPage() {
  const [selectedChapterId, setSelectedChapterId] = React.useState("");
  const [selectedChapterName, setSelectedChapterName] = React.useState("");

  // Sheet state (Team-style)
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selectedLeadId, setSelectedLeadId] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ chapterId, chapterName: "" })
    );
  };

  const {
    data: leads = [],
    isLoading,
    isError,
    isFetching
  } = useQuery({
    queryKey: ["chapter-leads", selectedChapterId],
    queryFn: () => getChapterLeads(selectedChapterId),
    enabled: !!selectedChapterId,
    staleTime: 30_000
  });

  const openCreate = () => {
    setSelectedLeadId(undefined);
    setSheetMode("create");
    setSheetOpen(true);
  };

  const openView = (lead: ChapterLead) => {
    setSelectedLeadId(lead._id);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const subtitle = selectedChapterId
    ? `Leads for ${selectedChapterName || "selected chapter"}.`
    : "Select a chapter to view and manage leads.";

  return (
    <TableShell
      title="Chapter Leads"
      description={subtitle}
      right={
        <div className="text-sm text-muted-foreground">
          {!selectedChapterId
            ? "No chapter selected"
            : isLoading
              ? "Loading…"
              : `${leads.length} lead(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Controls row (Team pattern) */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <ChapterSelect
              value={selectedChapterId}
              onValueChange={handleChapterChange}
              placeholder="Select a chapter"
            />

            <Button
              className="w-full sm:w-auto"
              onClick={openCreate}
              disabled={!selectedChapterId}
            >
              Add Lead
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedChapterId ? (isFetching ? "Refreshing…" : " ") : " "}
          </div>
        </div>

        {/* Content grid (Team pattern) */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-12 space-y-3">
            {/* Mobile list */}
            <div className="grid gap-3 md:hidden">
              {!selectedChapterId ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  Please select a chapter to view its leads.
                </div>
              ) : isLoading ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  Loading leads…
                </div>
              ) : isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load leads.
                </div>
              ) : leads.length ? (
                leads.map((lead) => (
                  <button
                    key={lead._id}
                    type="button"
                    onClick={() => openView(lead)}
                    className="text-left w-full"
                  >
                    {/* Mobile card should be display-only (no edit/delete buttons) */}
                    <MobileChapterLeadCard lead={lead} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    There are no leads for this chapter.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={openCreate}
                  >
                    Add First Lead
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              {!selectedChapterId ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  Please select a chapter to view its leads.
                </div>
              ) : (
                <TableFrame>
                  <ChapterLeadTable
                    rows={leads}
                    isLoading={isLoading}
                    isError={isError}
                    onRowClick={openView}
                  />
                </TableFrame>
              )}
            </div>
          </div>
        </div>

        {/* Lead Sheet (delete happens inside sheet) */}
        <ChapterLeadSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          leadId={selectedLeadId}
          chapterId={selectedChapterId}
        />
      </div>
    </TableShell>
  );
}
