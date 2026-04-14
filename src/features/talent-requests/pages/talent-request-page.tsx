// app/admin/talent-request/page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import { getTalentRequests } from "@/features/talent-requests/api";
import type {
  TalentRequest,
  TalentRequestFilters
} from "@/features/talent-requests/types";

import { TalentRequestFilters as Filters } from "@/features/talent-requests/components/talent-filters";
import { TalentRequestPagination } from "@/features/talent-requests/components/talent-pagination";
import { TalentTable } from "@/features/talent-requests/components/talent-table";
import { MobileTalentCard } from "@/features/talent-requests/components/mobile-talent-card";
import { MobileTalentSkeletonCard } from "@/features/talent-requests/components/mobile-talent-skeleton-card";
import { TalentRequestDetailsSheet } from "@/features/talent-requests/components/talent-details-sheet";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: TalentRequest[], f: TalentRequestFilters) {
  let out = [...rows];
  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (t) =>
        t.fullname?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.company?.toLowerCase().includes(q)
    );
  }
  if (f.status) out = out.filter((t) => (t.status ?? "Pending") === f.status);
  return out;
}

function toCSV(data: TalentRequest[]): string {
  const headers = [
    "Full Name",
    "Email",
    "Company",
    "Role",
    "Experience Level",
    "Skills",
    "Portfolio",
    "LinkedIn",
    "GitHub",
    "Status",
    "Created At",
    "Updated At"
  ];
  const rows = data.map((t) => [
    t.fullname ?? "",
    t.email ?? "",
    t.company ?? "",
    t.role ?? "",
    t.experienceLevel ?? "",
    (t.skills ?? []).join("; "),
    t.portfolio ?? "",
    t.linkedin ?? "",
    t.github ?? "",
    t.status ?? "Pending",
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

export default function TalentRequestPage() {
  const [filters, setFilters] = React.useState<TalentRequestFilters>({
    search: "",
    status: "",
    experienceLevel: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<TalentRequest | null>(null);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => setPage(1), [filters]);

  const query = useQuery({
    queryKey: ["talent-requests"],
    queryFn: getTalentRequests,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as TalentRequest[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const handleExport = async () => {
    if (!query.data || query.data.length === 0) {
      toast.error("No data to export.");
      return;
    }
    setExporting(true);
    try {
      const allData = query.data as TalentRequest[];
      const csv = toCSV(allData);
      const filename = `talent_requests_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;
      downloadCSV(csv, filename);
      toast.success("Exported successfully.");
    } catch (error) {
      toast.error("Failed to export.");
    } finally {
      setExporting(false);
    }
  };

  const handleCreate = () => {
    setSelected(null);
    setSheetOpen(true);
  };

  const handleRowClick = (t: TalentRequest) => {
    setSelected(t);
    setSheetOpen(true);
  };

  // For now, approve/reject open the same details sheet.
  // Later you can implement direct API calls or pass a mode to the sheet.
  const handleApprove = (t: TalentRequest) => {
    setSelected(t);
    setSheetOpen(true);
    // Optional: set a mode so the sheet opens with approve focus
  };

  const handleReject = (t: TalentRequest) => {
    setSelected(t);
    setSheetOpen(true);
    // Optional: set a mode for reject
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_TALENT_REQUEST}>
      <TableShell title="Talent Requests" description="Review talent requests.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Filters
              value={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({
                  search: "",
                  status: "",
                  experienceLevel: "",
                  sortBy: ""
                })
              }
              onExport={handleExport}
              onCreate={handleCreate}
            />
            <TalentRequestPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 md:hidden">
              {query.isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <MobileTalentSkeletonCard key={`talent-skel-${i}`} />
                  ))
                : paged.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => handleRowClick(t)}
                      className="text-left w-full"
                    >
                      <MobileTalentCard row={t} />
                    </button>
                  ))}
            </div>
            <div className="hidden md:block">
              <TableFrame>
                <TalentTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={handleRowClick}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </TableFrame>
            </div>
          </div>

          <TalentRequestDetailsSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            row={selected}
            onUpdate={() => query.refetch()}
            onDelete={() => query.refetch()}
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
