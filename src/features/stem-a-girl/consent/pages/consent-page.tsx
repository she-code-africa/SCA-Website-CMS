// src/features/stem-a-girl/consent/pages/consent-page.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";
import { TablePagination } from "@/features/stem-a-girl/shared/table-pagination";
import { downloadCsv, fmtDate } from "@/features/stem-a-girl/shared/format";
import { getConsentRecords } from "../api";
import { DEFAULT_CONSENT_FILTERS } from "../types";
import type { ConsentFilters, ConsentRecord } from "../types";
import { applyConsentFilters } from "../utils";
import { ConsentFilterBar } from "../components/consent-filter-bar";
import { ConsentTable } from "../components/consent-table";
import { ConsentSheet } from "../components/consent-sheet";
import {
  MobileConsentCard,
  MobileConsentSkeletonCard,
} from "../components/mobile-consent-card";

const PAGE_SIZE = 10;

export default function ConsentPage() {
  const [filters, setFilters] = React.useState<ConsentFilters>(
    DEFAULT_CONSENT_FILTERS,
  );
  const [page, setPage] = React.useState(1);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"view" | "edit">("view");
  const [selected, setSelected] = React.useState<ConsentRecord | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["consent-records"],
    queryFn: getConsentRecords,
    staleTime: 30_000,
  });

  const records = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );
  const filtered = React.useMemo(
    () => applyConsentFilters(records, filters),
    [records, filters],
  );

  const pendingCount = filtered.filter(
    (r) => r.consentStatus === "Pending",
  ).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changeFilters = (next: ConsentFilters) => {
    setFilters(next);
    setPage(1);
  };

  const openSheet = (record: ConsentRecord, mode: "view" | "edit") => {
    setSelected(record);
    setSheetMode(mode);
    setSheetOpen(true);
  };

  const handleExport = () => {
    downloadCsv(
      "shecode_consent_records.csv",
      [
        "Learner Name",
        "Username",
        "Age",
        "Current Course",
        "Prior Completed Course",
        "Guardian Email",
        "Consent Status",
        "Account Status",
        "Date Submitted",
      ],
      filtered.map((r) => [
        r.name,
        r.username,
        r.age,
        r.course,
        r.completedCourse ?? "None",
        r.guardianEmail,
        r.consentStatus,
        r.accountStatus,
        fmtDate(r.consentSubmittedAt),
      ]),
    );
    toast.success(`Exported ${filtered.length} consent record(s)`);
  };

  return (
    <TableShell
      title="Consent"
      description="Review, verify, and manage guardian consent for learners under 18."
      right={
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${pendingCount} pending consent(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <ConsentFilterBar
            value={filters}
            onChange={changeFilters}
            onReset={() => changeFilters(DEFAULT_CONSENT_FILTERS)}
            onExport={handleExport}
            exportDisabled={isLoading || filtered.length === 0}
          />
        </div>
        <div className="flex justify-end">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setPage(Math.max(1, currentPage - 1))}
            onNext={() => setPage(Math.min(totalPages, currentPage + 1))}
            isLoading={isLoading}
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-3 md:hidden">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileConsentSkeletonCard key={i} />
            ))
          ) : isError ? (
            <div className="text-center text-red-500">
              Failed to load consent records
            </div>
          ) : paged.length ? (
            paged.map((r) => (
              <button
                type="button"
                title="Mobile consent card"
                key={r._id}
                onClick={() => openSheet(r, "view")}
                className="w-full text-left"
              >
                <MobileConsentCard record={r} />
              </button>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No consent records found
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TableFrame>
            <ConsentTable
              rows={paged}
              isLoading={isLoading}
              isError={isError}
              onView={(r) => openSheet(r, "view")}
              onEdit={(r) => openSheet(r, "edit")}
            />
          </TableFrame>
        </div>

        <ConsentSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          record={selected}
          initialMode={sheetMode}
        />
      </div>
    </TableShell>
  );
}
