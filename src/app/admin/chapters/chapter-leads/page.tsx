// src/app/admin/chapters-leads/page.tsx
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

export const dynamic = "force-dynamic";

const STORAGE_KEY = "selectedChapterId-leads";

export default function ChapterLeadsPage() {
  const [selectedChapterId, setSelectedChapterId] = React.useState("");
  const [selectedChapterName, setSelectedChapterName] = React.useState("");

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selectedLeadId, setSelectedLeadId] = React.useState<
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

  return (
    <TableShell
      title="Chapter Leads"
      description={
        selectedChapterId
          ? `Leads for ${selectedChapterName || "selected chapter"}.`
          : "Select a chapter."
      }
      right={
        <div className="text-sm text-muted-foreground">
          {!selectedChapterId
            ? "No selection"
            : isLoading
              ? "Loading…"
              : `${leads.length} lead(s)`}
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
            <Button
              className="w-full sm:w-auto"
              onClick={openCreate}
              disabled={!selectedChapterId}
            >
              Add Lead
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedChapterId && isFetching ? "Refreshing…" : ""}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-12 space-y-3">
            <div className="grid gap-3 md:hidden">
              {!selectedChapterId ? (
                <div className="p-6 text-center text-muted-foreground border rounded-xl">
                  Select a chapter.
                </div>
              ) : (
                leads.map((lead) => (
                  <button
                    key={lead._id}
                    type="button"
                    onClick={() => openView(lead)}
                    className="text-left w-full"
                  >
                    <MobileChapterLeadCard lead={lead} />
                  </button>
                ))
              )}
            </div>

            <div className="hidden md:block">
              {selectedChapterId && (
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
