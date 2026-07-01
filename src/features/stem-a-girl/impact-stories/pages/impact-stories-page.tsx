// src/features/stem-a-girl/impact-stories/pages/impact-stories-page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getImpactStories } from "../api";
import { getSAGSchools } from "@/features/stem-a-girl/schools/api";
import type { ImpactStory, ImpactStoryFilters } from "../types";
import type { SAGSchool } from "@/features/stem-a-girl/schools/types";
import { ImpactStoriesTable } from "../components/impact-stories-table";
import { ImpactStorySheet } from "../components/impact-story-sheet";
import { ImpactStoriesFilters } from "../components/impact-stories-filters";
import { ImpactStoriesPagination } from "../components/impact-stories-pagination";
import { MobileImpactStoryCard } from "../components/mobile-impact-story-card";
import { MobileImpactStorySkeletonCard } from "../components/mobile-impact-story-skeleton-card";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyFilters(rows: ImpactStory[], filters: ImpactStoryFilters) {
  let out = [...rows];
  const search = filters.search?.trim().toLowerCase();
  if (search)
    out = out.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.story.toLowerCase().includes(search)
    );
  if (filters.state) out = out.filter((s) => s.state === filters.state);
  if (filters.school)
    out = out.filter((s) => getSchoolId(s) === filters.school);
  return out;
}

function getSchoolId(s: ImpactStory): string {
  const sc = s.school;
  if (!sc) return "";
  if (typeof sc === "string") return sc;
  return sc._id;
}

export default function ImpactStoriesPage() {
  const [filters, setFilters] = React.useState<ImpactStoryFilters>({
    search: "",
    state: "",
    school: "",
    sortBy: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const {
    data: stories = [],
    isLoading: loadingStories,
    isError
  } = useQuery({
    queryKey: ["impact-stories"],
    queryFn: getImpactStories,
    staleTime: 30_000
  });
  const { data: schoolsData = [], isLoading: loadingSchools } = useQuery({
    queryKey: ["sag-schools"],
    queryFn: () => getSAGSchools({}),
    staleTime: 60_000
  });
  const schools = schoolsData as SAGSchool[];
  const schoolMap = React.useMemo(
    () => new Map(schools.map((s) => [s._id, s.name])),
    [schools]
  );

const filtered = React.useMemo(() => {
  const sorted = [...stories].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );
  return applyFilters(sorted, filters);
}, [stories, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  React.useEffect(() => {
    const handler = () => {
      setSelectedId(null);
      setSheetMode("create");
      setSheetOpen(true);
    };
    window.addEventListener("impact-story:add", handler);
    return () => window.removeEventListener("impact-story:add", handler);
  }, []);

  const openView = (s: ImpactStory) => {
    setSelectedId(s._id);
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (s: ImpactStory) => {
    setSelectedId(s._id);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const isLoading = loadingStories || loadingSchools;

  return (
    <TableShell
      title="Impact Stories"
      description="Share success stories from girls in the STEM-A-Girl program."
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <ImpactStoriesFilters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({ search: "", state: "", school: "", sortBy: "" })
            }
            schools={schools}
          />
        </div>
        <div className="flex justify-end">
          <ImpactStoriesPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={isLoading}
          />
        </div>
        <div className="grid gap-3 md:hidden">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileImpactStorySkeletonCard key={i} />
            ))
          ) : isError ? (
            <div className="text-red-500">Failed to load</div>
          ) : (
            paged.map((s) => (
              <button key={s._id} onClick={() => openView(s)}>
                <MobileImpactStoryCard story={s} schoolMap={schoolMap} />
              </button>
            ))
          )}
        </div>
        <div className="hidden md:block">
          <TableFrame>
            <ImpactStoriesTable
              rows={paged}
              isLoading={isLoading}
              isError={isError}
              onView={openView}
              onEdit={openEdit}
              schoolMap={schoolMap}
            />
          </TableFrame>
        </div>
        <ImpactStorySheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          storyId={selectedId || undefined}
        />
      </div>
    </TableShell>
  );
}
