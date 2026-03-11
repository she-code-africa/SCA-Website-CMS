"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { getCompanies } from "@/features/companies/api";
import type { Company, CompanyFilters } from "@/features/companies/types";

import { CompanyFilters as Filters } from "@/features/companies/components/company-filters";
import { CompanyTable } from "@/features/companies/components/company-table";
import { MobileCompanyCard } from "@/features/companies/components/mobile-company-card";
import { MobileCompanySkeletonCard } from "@/features/companies/components/mobile-company-skeleton-card";
import { CompanySheet } from "@/features/companies/components/company-sheet";
import { CompanyPagination } from "@/features/companies/components/company-pagination";

import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

function applyClientFilters(rows: Company[], f: CompanyFilters) {
  let out = [...rows];
  const q = f.search?.trim().toLowerCase();
  if (q) {
    out = out.filter((c) => {
      return (
        c.companyName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    });
  }

  if (f.state) out = out.filter((c) => c.state === f.state);

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

export default function CompaniesPage() {
  const [filters, setFilters] = React.useState<CompanyFilters>({
    search: "",
    state: "",
    sortBy: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Company | null>(null);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.state, filters.sortBy]);

  const query = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    staleTime: 30_000
  });

  const rows = React.useMemo(
    () => applyClientFilters((query.data ?? []) as Company[], filters),
    [query.data, filters]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (c: Company) => {
    setSelected(c);
    setModalOpen(true);
  };

  return (
    <TableShell
      title="Companies"
      description="Companies are automatically registered when they post jobs."
      right={
        <div className="text-sm text-muted-foreground">
          {query.isLoading ? "Loading…" : `${rows.length} company(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", state: "", sortBy: "" })}
          />

          <CompanyPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={query.isFetching}
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-12 space-y-3">
            <div className="grid gap-3 md:hidden">
              {query.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MobileCompanySkeletonCard key={`comp-skeleton-${i}`} />
                ))
              ) : query.isError ? (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                  Failed to load companies.
                </div>
              ) : paged.length ? (
                paged.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => openView(c)}
                    className="text-left w-full"
                  >
                    <MobileCompanyCard company={c} />
                  </button>
                ))
              ) : (
                <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                  No companies found.
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <TableFrame>
                <CompanyTable
                  rows={paged}
                  isLoading={query.isLoading}
                  isError={query.isError}
                  onRowClick={openView}
                />
              </TableFrame>
            </div>
          </div>
        </div>

        <CompanySheet
          open={modalOpen}
          onOpenChange={setModalOpen}
          companyId={selected?._id}
        />
      </div>
    </TableShell>
  );
}
