"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import { getTestimonials } from "@/features/testimonials/api";
import type {
  Testimonial,
  TestimonialFilters
} from "@/features/testimonials/types";

import { TestimonialFilters as Filters } from "@/features/testimonials/components/testimonial-filters";
import { TestimonialTable } from "@/features/testimonials/components/testimonial-table";
import { MobileTestimonialCard } from "@/features/testimonials/components/mobile-testimonial-card";
import { MobileTestimonialSkeletonCard } from "@/features/testimonials/components/mobile-testimonial-skeleton-card";
import { TestimonialSheet } from "@/features/testimonials/components/testimonial-sheet";
import { TestimonialPagination } from "@/features/testimonials/components/testimonial-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

// Helper: convert array to CSV
function toCSV(data: Testimonial[]): string {
  const headers = [
    "Name",
    "Role",
    "Content",
    "Rating",
    "State",
    "Publish Date",
    "Created At",
    "Updated At"
  ];
  const rows = data.map((t) => [
    t.name ?? "",
    t.role ?? "",
    (t.content ?? "").replace(/,/g, " ").replace(/\n/g, " "),
    t.rating ?? "",
    t.state ?? "",
    t.publishDate ? new Date(t.publishDate).toLocaleString() : "",
    t.createdAt ? new Date(t.createdAt).toLocaleString() : "",
    t.updatedAt ? new Date(t.updatedAt).toLocaleString() : ""
  ]);
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function applyClientFilters(rows: Testimonial[], f: TestimonialFilters) {
  let out = [...rows];
  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((t) => {
      return (
        t.name?.toLowerCase().includes(q) || t.role?.toLowerCase().includes(q)
      );
    });
  }
  if (f.state) out = out.filter((t) => t.state === f.state);
  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Testimonial, b: Testimonial) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (key === "createdAt" || key === "updatedAt" || key === "publishDate") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  }
  return out;
}

export default function TestimonialsPage() {
  const [filters, setFilters] = React.useState<TestimonialFilters>({
    search: "",
    state: "",
    sortBy: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<Testimonial | null>(null);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("testimonial:add", handler);
    return () => window.removeEventListener("testimonial:add", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.sortBy]);

  const query = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Testimonial[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (t: Testimonial) => {
    setSelected(t);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleExport = async () => {
    if (!query.data || query.data.length === 0) {
      toast.error("No data to export.");
      return;
    }
    setExporting(true);
    try {
      const allData = query.data as Testimonial[];
      const csv = toCSV(allData);
      const filename = `testimonials_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;
      downloadCSV(csv, filename);
      toast.success("Exported successfully.");
    } catch (error) {
      toast.error("Failed to export.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_TESTIMONIALS}>
      <TableShell
        title="Testimonials"
        description="Review, publish, and manage testimonials submitted across the platform."
        right={
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} testimonial(s)`}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Filters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ search: "", state: "", sortBy: "" })}
              onExport={handleExport}
            />
            <TestimonialPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 md:hidden">
              {query.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MobileTestimonialSkeletonCard key={i} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load testimonials.
                </div>
              ) : paged.length ? (
                paged.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => openView(t)}
                    className="text-left w-full"
                  >
                    <MobileTestimonialCard testimonial={t} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No testimonials found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <TestimonialTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>

          <TestimonialSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            testimonialId={selected?._id}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
