// src/app/admin/chapters/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getChapters } from "@/features/chapters/api";
import type { Chapter, ChapterFilters } from "@/features/chapters/types";

import { ChapterFilters as Filters } from "@/features/chapters/components/chapter-filters";
import { ChapterTable } from "@/features/chapters/components/chapter-table";
import { MobileChapterCard } from "@/features/chapters/components/mobile-chapter-card";
import { MobileChapterSkeletonCard } from "@/features/chapters/components/mobile-chapter-skeleton-card";
import { ChapterCategoriesPanel } from "@/features/chapters/components/chapter-categories-panel";
import { ChapterSheet } from "@/features/chapters/components/chapter-sheet";
import { ChapterPagination } from "@/features/chapters/components/chapter-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

/**
 * FORCE DYNAMIC: Bypasses build-time pre-rendering for the admin chapter table.
 */
export const dynamic = "force-dynamic";

function extractCategoryId(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val._id || "";
}

function applyClientFilters(rows: Chapter[], f: ChapterFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((ch) => ch.name?.toLowerCase().includes(q));
  }

  if (f.state) {
    out = out.filter((ch) => ch.state === f.state);
  }

  if (f.category) {
    out = out.filter((ch) => extractCategoryId(ch.category) === f.category);
  }

  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: any, b: any) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    out.sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );
  }

  return out;
}

export default function ChaptersPage() {
  const [filters, setFilters] = React.useState<ChapterFilters>({
    search: "",
    state: "" as any,
    category: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Chapter | null>(null);

  /**
   * HYDRATION GUARD: Safely attaches event listeners on the client.
   */
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("chapter:add", handler);
    return () => window.removeEventListener("chapter:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.category, filters.sortBy]);

  const query = useQuery({
    queryKey: ["chapters"],
    queryFn: () => getChapters(1, 1000),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => {
    const allRows = query.data?.data ?? [];
    return applyClientFilters(allRows as Chapter[], filters);
  }, [query.data, filters]);

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (ch: Chapter) => {
    setSelected(ch);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Chapters"
      description="Manage chapters and categories."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} chapter(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({
                search: "",
                state: "" as any,
                category: "",
                sortBy: ""
              })
            }
          />

          <ChapterPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={query.isFetching}
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-9 space-y-3">
            <div className="grid gap-3 md:hidden">
              {query.isLoading ? (
                // UNIQUE KEYS: Fixed with prefixing
                Array.from({ length: 6 }).map((_, i) => (
                  <MobileChapterSkeletonCard key={`chapter-skeleton-${i}`} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load chapters.
                </div>
              ) : paged.length ? (
                paged.map((ch) => (
                  <button
                    key={ch._id}
                    type="button"
                    onClick={() => openView(ch)}
                    className="text-left w-full"
                  >
                    <MobileChapterCard chapter={ch} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No chapters found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <ChapterTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <ChapterCategoriesPanel />
          </div>
        </div>

        <ChapterSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          chapterId={selected?._id}
          categoryId={
            selected && typeof selected.category !== "string"
              ? selected.category?._id
              : undefined
          }
        />
      </div>
    </TableShell>
  );
}
