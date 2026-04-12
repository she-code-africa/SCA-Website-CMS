"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import { getVolunteerRequests } from "@/features/volunteer-requests/api";
import type {
  VolunteerFilters,
  VolunteerRequest
} from "@/features/volunteer-requests/types";

import { VolunteerFilters as Filters } from "@/features/volunteer-requests/components/volunteer-filters";
import { VolunteerTable } from "@/features/volunteer-requests/components/volunteer-table";
import { MobileVolunteerCard } from "@/features/volunteer-requests/components/mobile-volunteer-card";
import { MobileVolunteerSkeletonCard } from "@/features/volunteer-requests/components/mobile-volunteer-skeleton-card";
import { VolunteerDetailsSheet } from "@/features/volunteer-requests/components/volunteer-details-sheet";
import { VolunteerPagination } from "@/features/volunteer-requests/components/volunteer-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

// Helper: convert array to CSV
function toCSV(data: VolunteerRequest[]): string {
  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Current Role",
    "Volunteer Role",
    "Purpose",
    "Status",
    "Created At",
    "Updated At"
  ];
  const rows = data.map((v) => [
    v.fullname ?? "",
    v.email ?? "",
    v.phone ?? "",
    v.currentRole ?? "",
    v.volunteerRole ?? "",
    (v.purpose ?? "").replace(/,/g, " ").replace(/\n/g, " "),
    v.status ?? "",
    v.createdAt ? new Date(v.createdAt).toLocaleString() : "",
    v.updatedAt ? new Date(v.updatedAt).toLocaleString() : ""
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

function applyClientFilters(rows: VolunteerRequest[], f: VolunteerFilters) {
  let out = [...rows];
  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((v) => {
      return (
        v.fullname?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.currentRole?.toLowerCase().includes(q) ||
        v.purpose?.toLowerCase().includes(q) ||
        v.volunteerRole?.toLowerCase().includes(q)
      );
    });
  }
  if (f.status) out = out.filter((v) => v.status === f.status);
  if (f.volunteerRole)
    out = out.filter((v) => v.volunteerRole === f.volunteerRole);
  if (f.sortBy) {
    const key = f.sortBy;
    out.sort((a, b) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (key === "createdAt" || key === "updatedAt") {
        return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
      }
      return String(av ?? "").localeCompare(String(bv ?? ""));
    });
  }
  return out;
}

export default function VolunteersPage() {
  const [filters, setFilters] = React.useState<VolunteerFilters>({
    search: "",
    status: "",
    volunteerRole: "",
    sortBy: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<VolunteerRequest | null>(null);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.volunteerRole, filters.sortBy]);

  const query = useQuery({
    queryKey: ["volunteers"],
    queryFn: getVolunteerRequests,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as VolunteerRequest[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (v: VolunteerRequest) => {
    setSelected(v);
    setModalOpen(true);
  };

  const handleExport = async () => {
    if (!query.data || query.data.length === 0) {
      toast.error("No data to export.");
      return;
    }
    setExporting(true);
    try {
      const allData = query.data as VolunteerRequest[];
      const csv = toCSV(allData);
      const filename = `volunteer_requests_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;
      downloadCSV(csv, filename);
      toast.success("Exported successfully.");
    } catch (error) {
      toast.error("Failed to export.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_VOLUNTEER_REQUEST}>
      <TableShell
        title="Volunteer Requests"
        description="Review volunteer requests and update approval status."
        right={
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} result(s)`}
          </div>
        }
      >
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Filters
              value={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({
                  search: "",
                  status: "",
                  volunteerRole: "",
                  sortBy: ""
                })
              }
              onExport={handleExport}
            />
            <VolunteerPagination
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
                  <MobileVolunteerSkeletonCard key={i} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load volunteer requests.
                </div>
              ) : paged.length ? (
                paged.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => openView(v)}
                    className="text-left w-full"
                  >
                    <MobileVolunteerCard row={v} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No volunteer requests found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <VolunteerTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>

          <VolunteerDetailsSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            id={selected?._id ?? null}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
