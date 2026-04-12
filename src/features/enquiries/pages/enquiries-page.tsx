// src/app/admin/enquiries/page.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

import { getEnquiries } from "@/features/enquiries/api";
import type { Enquiry, EnquiryFilters } from "@/features/enquiries/types";

import { EnquiryFilters as Filters } from "@/features/enquiries/components/enquiry-filters";
import { EnquiryPagination } from "@/features/enquiries/components/enquiry-pagination";
import { EnquiryTable } from "@/features/enquiries/components/enquiry-table";
import { MobileEnquiryCard } from "@/features/enquiries/components/mobile-enquiry-card";
import { MobileEnquirySkeletonCard } from "@/features/enquiries/components/mobile-enquiry-skeleton-card";
import { EnquiryDetailsSheet } from "@/features/enquiries/components/enquiry-details-sheet";

// Helper: convert array of objects to CSV string
function toCSV(data: Enquiry[]): string {
  const headers = [
    "Full Name",
    "Email",
    "Message",
    "Status",
    "Created At",
    "Updated At"
  ];
  const rows = data.map((e) => [
    e.fullName ?? "",
    e.email ?? "",
    (e.description ?? "").replace(/,/g, " ").replace(/\n/g, " "),
    e.status ?? "open",
    e.createdAt ? new Date(e.createdAt).toLocaleString() : "",
    e.updatedAt ? new Date(e.updatedAt).toLocaleString() : ""
  ]);
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  return csvContent;
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

function applyClientFilters(rows: Enquiry[], f: EnquiryFilters) {
  let out = [...rows];

  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((e) => {
      return (
        e.fullName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q)
      );
    });
  }

  if (f.status) out = out.filter((e) => (e.status ?? "open") === f.status);

  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a: Enquiry, b: Enquiry) => {
      const av = a?.[key as keyof Enquiry];
      const bv = b?.[key as keyof Enquiry];

      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  } else {
    out.sort(
      (a, b) =>
        new Date(b.updatedAt ?? 0).getTime() -
        new Date(a.updatedAt ?? 0).getTime()
    );
  }

  return out;
}

export default function EnquiriesPage() {
  const [filters, setFilters] = React.useState<EnquiryFilters>({
    search: "",
    status: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(
    () => setPage(1),
    [filters.search, filters.status, filters.sortBy]
  );

  const query = useQuery({
    queryKey: ["enquiries"],
    queryFn: getEnquiries,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Enquiry[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  function openDetails(e: Enquiry) {
    setSelectedId(e._id);
    setDetailsOpen(true);
  }

  async function exportEnquiries() {
    if (!query.data || query.data.length === 0) {
      toast.error("No enquiries to export.");
      return;
    }
    setExporting(true);
    try {
      const allEnquiries = query.data as Enquiry[];
      const csv = toCSV(allEnquiries);
      const filename = `enquiries_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;
      downloadCSV(csv, filename);
      toast.success("Exported successfully.");
    } catch (error) {
      toast.error("Failed to export enquiries.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_ENQUIRY}>
      <TableShell
        title="Enquiries"
        description="Messages submitted through the website contact form."
        right={
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} enquiry(s)`}
          </div>
        }
      >
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group: Filters + Export button */}
            <div className="flex flex-wrap items-center gap-2">
              <Filters
                value={filters}
                onChange={setFilters}
                onReset={() =>
                  setFilters({ search: "", status: "", sortBy: "" })
                }
              />
              <PermissionGate permission={PERMISSIONS.EXPORT_ENQUIRY}>
                <Button
                  variant="default"
                  size="sm"
                  onClick={exportEnquiries}
                  disabled={exporting || query.isLoading}
                  className="shrink-0"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exporting ? "Exporting…" : "Export"}
                </Button>
              </PermissionGate>
            </div>

            {/* Right group: Pagination */}
            <EnquiryPagination
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
                  <MobileEnquirySkeletonCard key={`enquiry-skeleton-${i}`} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load enquiries.
                </div>
              ) : paged.length ? (
                paged.map((e) => (
                  <button
                    key={e._id}
                    type="button"
                    onClick={() => openDetails(e)}
                    className="text-left w-full"
                  >
                    <MobileEnquiryCard row={e} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No enquiries found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <EnquiryTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openDetails}
                />
              </TableFrame>
            </div>
          </div>

          <EnquiryDetailsSheet
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            id={selectedId}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
