"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Download, Users, FileDown } from "lucide-react";

import { getReportDownloads } from "@/features/reports/api";
import type { ReportDownloadUser } from "@/features/reports/types";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { ReportLogTable } from "@/features/reports/components/report-log-downloads/report-log-table";
import { MobileReportLogCard } from "@/features/reports/components/report-log-downloads/mobile-report-log-card";
import { MobileReportLogSkeletonCard } from "@/features/reports/components/report-log-downloads/mobile-report-log-skeleton-card";
import { ReportPagination } from "@/features/reports/components/report-pagination";
import { toast } from "sonner";

/* ───────── Helper: Convert data to CSV string ───────── */
function toCSV(data: ReportDownloadUser[]): string {
  const headers = ["First Name", "Last Name", "Email"];
  const rows = data.map((u) => [
    u.firstname ?? "",
    u.lastname ?? "",
    u.email ?? ""
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

export default function AnnualReportLogPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [exporting, setExporting] = React.useState(false);

  const query = useQuery({
    queryKey: ["annual-report-log"],
    queryFn: getReportDownloads,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => (query.data ?? []) as ReportDownloadUser[],
    [query.data]
  );

  const uniqueUsers = React.useMemo(() => {
    const emails = new Set(
      rows.map((r) => r.email?.trim().toLowerCase()).filter(Boolean)
    );
    return emails.size;
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const handleExport = async () => {
    if (!rows.length) {
      toast.error("No data to export.");
      return;
    }
    setExporting(true);
    try {
      const csv = toCSV(rows);
      const filename = `annual_report_log_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.csv`;
      downloadCSV(csv, filename);
      toast.success("Exported successfully.");
    } catch (error) {
      toast.error("Failed to export.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <TableShell
      title="Annual report views"
      description="Everyone who downloaded an annual report."
      right={
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} download(s)`}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/reports">Back to Reports</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Annual report log</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total downloads</p>
                <p className="text-2xl font-medium">
                  {query.isLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    rows.length
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Unique users</p>
                <p className="text-2xl font-medium">
                  {query.isLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    uniqueUsers
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export button + Pagination */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="default"
            size="lg"
            onClick={handleExport}
            disabled={exporting || rows.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>

          <ReportPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 md:hidden">
          {query.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileReportLogSkeletonCard key={`log-skeleton-${i}`} />
            ))
          ) : query.isError ? (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
              Failed to load report log.
            </div>
          ) : paged.length ? (
            paged.map((u) => <MobileReportLogCard key={u._id} user={u} />)
          ) : (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
              No downloads recorded yet.
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <TableFrame>
            <ReportLogTable
              rows={paged}
              isLoading={query.isLoading}
              isError={query.isError}
            />
          </TableFrame>
        </div>
      </div>
    </TableShell>
  );
}
