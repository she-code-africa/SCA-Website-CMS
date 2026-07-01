// src/features/activity-log/components/activity-log-table.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  getActivityLog,
  exportActivityLogs
} from "@/features/activity-log/api";
import { normalizeActivityLogPayload } from "@/features/activity-log/normalize";
import type {
  AuditLogEntry,
  DateRangePreset
} from "@/features/activity-log/types";
import { resolveDatePreset } from "@/features/activity-log/utils";

import { ActivityLogDetailsDrawer } from "@/features/activity-log/components/activity-log-details-drawer";
import { ActivityLogFilters } from "@/features/activity-log/components/activity-log-filters";
import { ActivityLogExportDialog } from "@/features/activity-log/components/activity-log-export-dialog";
import { ActivityLogPagination } from "@/features/activity-log/components/activity-log-pagination";
import { MobileLogCard } from "@/features/activity-log/components/mobile-log-card";
import { MobileSkeletonCard } from "@/features/activity-log/components/mobile-skeleton-card";
import { columns } from "@/features/activity-log/components/columns";
import { globalFilterFn } from "@/features/activity-log/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/usePermissions";

const PAGE_SIZE = 10;

export function ActivityLogTable() {
  const { can } = usePermissions();

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [page, setPage] = React.useState(1);

  // ── Filters ────────────────────────────────────────────────────────────────
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [datePreset, setDatePreset] = React.useState<DateRangePreset>("all");

  // Compute actual date range from the preset
  const { startDate, endDate } = React.useMemo(
    () => resolveDatePreset(datePreset),
    [datePreset]
  );

  // ── Export dialog ──────────────────────────────────────────────────────────
  const [exportOpen, setExportOpen] = React.useState(false);
  const [exportStart, setExportStart] = React.useState<Date | null>(null);
  const [exportEnd, setExportEnd] = React.useState<Date | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  // ── Row detail drawer ──────────────────────────────────────────────────────
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<AuditLogEntry | null>(
    null
  );

  // ── Auth guard ─────────────────────────────────────────────────────────────
  const hasToken = React.useMemo(
    () => Boolean(localStorage.getItem("token")),
    []
  );

  // ── Data fetching ──────────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [
      "activity-log",
      page,
      PAGE_SIZE,
      startDate?.toISOString() ?? null,
      endDate?.toISOString() ?? null
    ],
    queryFn: () =>
      getActivityLog({ page, limit: PAGE_SIZE, startDate, endDate }),
    enabled: hasToken && can("VIEW_DASHBOARD"),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 30_000,
    placeholderData: (prev) => prev
  });

  // ── Normalise payload ──────────────────────────────────────────────────────
  const { rows, totalPages } = React.useMemo(
    () => normalizeActivityLogPayload(query.data ?? {}),
    [query.data]
  );

  // ── Error helpers ──────────────────────────────────────────────────────────
  const isUnauthorized = React.useMemo(() => {
    const err = query.error as { response?: { status?: number } } | null;
    return err?.response?.status === 401;
  }, [query.error]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handlePrevious() {
    setPage((p) => Math.max(1, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function handleReset() {
    setDatePreset("all");
    setGlobalFilter("");
    setPage(1);
  }

  function handleDatePresetChange(preset: DateRangePreset) {
    setDatePreset(preset);
    setPage(1);
  }

  function handleExportClick() {
    setExportStart(startDate);
    setExportEnd(endDate);
    setExportOpen(true);
  }

  function openDetails(row: AuditLogEntry) {
    setSelectedRow(row);
    setDetailsOpen(true);
  }

  async function exportLogs() {
    if (!exportStart || !exportEnd || exportStart > exportEnd) return;
    if (!hasToken) {
      toast.error("Please log in first to export logs.");
      return;
    }

    setIsExporting(true);
    try {
      const blob = await exportActivityLogs({
        startDate: exportStart,
        endDate: exportEnd
      });
      const url = URL.createObjectURL(blob);
      const filename = `activity_log_${format(exportStart, "dd-MM-yyyy")}_to_${format(exportEnd, "dd-MM-yyyy")}.csv`;
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: filename
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
      setExportOpen(false);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        e?.response?.data?.message ?? e?.message ?? "Failed to export logs."
      );
    } finally {
      setIsExporting(false);
    }
  }

  // ── Table instance ─────────────────────────────────────────────────────────
  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ActivityLogFilters
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          datePreset={datePreset}
          onDatePresetChange={handleDatePresetChange}
          onReset={handleReset}
          onExportClick={handleExportClick}
        />

        <ActivityLogPagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isLoading={query.isFetching}
        />
      </div>

      <div className="space-y-3">
        {/* ── Mobile cards ── */}
        <div className="grid gap-3 md:hidden">
          {query.isFetching ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileSkeletonCard key={i} />
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openDetails(r.original)}
                className="w-full text-left"
              >
                <MobileLogCard row={r.original} />
              </button>
            ))
          ) : (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
              No activity found.
            </div>
          )}
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-275">
                <TableHeader className="sticky top-0 z-10 bg-card">
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="border-b">
                      {hg.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {query.isFetching ? (
                    Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                      <TableRow key={idx} className="hover:bg-transparent">
                        {columns.map((_, cIdx) => (
                          <TableCell key={cIdx}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => openDetails(row.original)}
                        className="cursor-pointer hover:bg-primary/5"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No activity found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error states ── */}
      {!hasToken ? (
        <p className="text-sm text-red-500">
          You are not logged in. Please log in to view activity logs.
        </p>
      ) : isUnauthorized ? (
        <p className="text-sm text-red-500">
          Session expired or invalid token. Please log in again.
        </p>
      ) : query.isError ? (
        <p className="text-sm text-red-500">Failed to load activity logs.</p>
      ) : null}

      <ActivityLogExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        exportStart={exportStart}
        onExportStartChange={setExportStart}
        exportEnd={exportEnd}
        onExportEndChange={setExportEnd}
        isExporting={isExporting}
        onExport={exportLogs}
        onCancel={() => {
          setExportStart(null);
          setExportEnd(null);
          setExportOpen(false);
        }}
      />

      <ActivityLogDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        row={selectedRow}
      />
    </div>
  );
}
