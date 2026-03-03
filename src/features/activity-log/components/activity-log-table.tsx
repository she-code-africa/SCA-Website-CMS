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

import { getActivityLog } from "@/features/activity-log/api";
import { normalizeActivityLogPayload } from "@/features/activity-log/normalize";
import type {
  ActivityLogPayload,
  ActivityLogRow
} from "@/features/activity-log/types";

import { ActivityLogDetailsDrawer } from "@/features/activity-log/components/activity-log-details-drawer";
import { ActivityLogFilters } from "@/features/activity-log/components/activity-log-filters";
import { ActivityLogExportDialog } from "@/features/activity-log/components/activity-log-export-dialog";
import { ActivityLogPagination } from "@/features/activity-log/components/activity-log-pagination";
import { MobileLogCard } from "@/features/activity-log/components/mobile-log-card";
import { MobileSkeletonCard } from "@/features/activity-log/components/mobile-skeleton-card";
import { columns } from "@/features/activity-log/components/columns";
import {
  globalFilterFn,
  toCSV,
  downloadCSV
} from "@/features/activity-log/utils";
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

export function ActivityLogTable() {
  const { can } = usePermissions();
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [exportOpen, setExportOpen] = React.useState(false);
  const [exportStart, setExportStart] = React.useState<Date | null>(null);
  const [exportEnd, setExportEnd] = React.useState<Date | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const [hasToken, setHasToken] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<ActivityLogRow | null>(
    null
  );

  React.useEffect(() => {
    setHasToken(Boolean(localStorage.getItem("token")));
  }, []);

  const query = useQuery({
    queryKey: [
      "activity-log",
      page,
      limit,
      startDate?.toISOString(),
      endDate?.toISOString()
    ],
    queryFn: () => getActivityLog({ page, limit, startDate, endDate }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 30_000,
    enabled: hasToken && can("VIEW_DASHBOARD")
  });

  const isUnauthorized = (() => {
    const err = query.error as unknown;
    if (!err || typeof err !== "object") return false;
    const maybe = err as { response?: { status?: number } };
    return maybe.response?.status === 401;
  })();

  function openDetails(row: ActivityLogRow) {
    setSelectedRow(row);
    setDetailsOpen(true);
  }

  async function exportLogs() {
    if (!exportStart || !exportEnd) return;
    if (exportStart > exportEnd) return;

    if (!hasToken) {
      toast.error("Please login first to export logs.");
      return;
    }

    setIsExporting(true);

    try {
      let all: ActivityLogRow[] = [];
      let current = 1;
      const exportLimit = 500;

      while (true) {
        const payload = (await getActivityLog({
          page: current,
          limit: exportLimit,
          startDate: exportStart,
          endDate: exportEnd
        })) as ActivityLogPayload;

        const pageRows = payload?.data ?? [];
        const total = payload?.totalPages ?? 1;

        all = all.concat(pageRows);

        current += 1;
        if (current > total || pageRows.length === 0) break;
      }

      const filename = `activity_log_${format(exportStart, "dd-MM-yyyy")}_to_${format(exportEnd, "dd-MM-yyyy")}.csv`;

      downloadCSV(toCSV(all), filename);

      toast.success("CSV exported successfully");
      setExportOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Failed to export logs.";
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  }

  const { rows, totalPages, currentPage } = React.useMemo(() => {
    const raw = (query.data ?? {}) as ActivityLogPayload;
    return normalizeActivityLogPayload(raw);
  }, [query.data]);

  React.useEffect(() => {
    if (!query.isLoading && currentPage && currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, query.isLoading, page]);

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

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ActivityLogFilters
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          startDate={startDate}
          onStartDateChange={(date) => {
            setStartDate(date);
            setPage(1);
          }}
          endDate={endDate}
          onEndDateChange={(date) => {
            setEndDate(date);
            setPage(1);
          }}
          onReset={() => {
            setStartDate(null);
            setEndDate(null);
            setGlobalFilter("");
            setPage(1);
          }}
          onExportClick={() => setExportOpen(true)}
        />

        <ActivityLogPagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
          isLoading={query.isFetching}
        />
      </div>

      {/* Responsive table: mobile cards + desktop table */}
      <div className="space-y-3">
        {/* Mobile list */}
        <div className="grid gap-3 md:hidden">
          {query.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileSkeletonCard key={i} />
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openDetails(r.original)}
                className="text-left w-full"
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

        {/* Tablet + Desktop table */}
        {/* Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
                {query.isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={idx} className="hover:bg-transparent">
                      {columns.map((_, cIdx) => (
                        <TableCell key={cIdx}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => openDetails(row.original)}
                        className="cursor-pointer hover:bg-primary/5"
                      >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
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

      {/* Error messages */}
      {!hasToken ? (
        <p className="text-sm text-red-500">
          You are not logged in. Please login to view activity logs.
        </p>
      ) : isUnauthorized ? (
        <p className="text-sm text-red-500">
          Session expired or invalid token. Please login again.
        </p>
      ) : query.isError ? (
        <p className="text-sm text-red-500">Failed to load activity logs.</p>
      ) : null}

      {/* Export Dialog */}
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

      {/* Details Drawer */}
      <ActivityLogDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        row={selectedRow}
      />
    </div>
  );
}
