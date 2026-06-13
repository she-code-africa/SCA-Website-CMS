"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Download, Users } from "lucide-react";

import { getReportDownloads } from "@/features/reports/api";
import type { ReportDownloadUser } from "@/features/reports/types";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";
import { Card, CardContent } from "@/components/ui/card";
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

export default function AnnualReportLogPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

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

  return (
    <TableShell
      title="Annual report views"
      description="Everyone who downloaded an annual report."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} download(s)`}
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

        <div className="flex justify-end">
          <ReportPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

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
