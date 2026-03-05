"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getAllMedia } from "@/features/media/api";
import type { Media, MediaFiltersType } from "@/features/media/types";

import { MediaFilters } from "@/features/media/components/media-filters";
import { MediaTable } from "@/features/media/components/media-table";
import { MediaSheet } from "@/features/media/components/media-sheet";
import { MediaPagination } from "@/features/media/components/media-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export const dynamic = "force-dynamic";

export default function MediaPage() {
  const [filters, setFilters] = React.useState<MediaFiltersType>({
    search: "",
    type: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Media | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("media:add", handler);
    return () => window.removeEventListener("media:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.type]);

  const query = useQuery({
    queryKey: ["media", filters],
    queryFn: () => getAllMedia(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (media: Media) => {
    setSelected(media);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Media"
      description="Manage blogs, videos, and image galleries."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} item(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <MediaFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", type: "" })}
          />

          <MediaPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        <div className="space-y-3">
          <div className="md:hidden">
            <MediaTable
              rows={paged}
              isLoading={query.isLoading}
              isError={query.isError}
              onRowClick={openView}
            />
          </div>

          <div className="hidden md:block">
            <TableFrame>
              <MediaTable
                rows={paged}
                isLoading={query.isLoading}
                isError={query.isError}
                onRowClick={openView}
              />
            </TableFrame>
          </div>
        </div>

        <MediaSheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          mediaId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
