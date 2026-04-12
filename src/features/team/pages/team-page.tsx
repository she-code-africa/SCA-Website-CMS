"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import { getMembers } from "@/features/team/api";
import type { TeamMember, TeamMembersFilters } from "@/features/team/types";

import { TeamFilters } from "@/features/team/components/team-filters";
import { TeamTable } from "@/features/team/components/team-table";
import { MobileTeamCard } from "@/features/team/components/mobile-team-card";
import { MobileTeamSkeletonCard } from "@/features/team/components/mobile-team-skeleton-card";
import { TeamCategoriesPanel } from "@/features/team/components/team-categories";
import { TeamMemberSheet } from "@/features/team/components/team-member-sheet";
import { TeamPagination } from "@/features/team/components/team-pagination";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";

export default function TeamPage() {
  const [filters, setFilters] = React.useState<TeamMembersFilters>({
    search: "",
    isLeader: "",
    state: "",
    team: ""
  });

  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
  const [selected, setSelected] = React.useState<TeamMember | null>(null);

  React.useEffect(() => {
    const handler = () => {
      setSelected(null);
      setModalMode("create");
      setModalOpen(true);
    };
    window.addEventListener("team:add-member", handler);
    return () => window.removeEventListener("team:add-member", handler);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [filters.search, filters.isLeader, filters.state, filters.team]);

  const query = useQuery({
    queryKey: ["team", filters],
    queryFn: () => getMembers(filters),
    staleTime: 30_000
  });

  const rows = React.useMemo(() => query.data ?? [], [query.data]);
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const paged = rows.slice((page - 1) * limit, page * limit);

  const openView = (m: TeamMember) => {
    setSelected(m);
    setModalMode("view");
    setModalOpen(true);
  };

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_TEAM}>
      <TableShell
        title="Team"
        description="Manage members and categories."
        right={
          <div className="text-sm text-muted-foreground">
            {query.isLoading ? "Loading…" : `${rows.length} member(s)`}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TeamFilters
              value={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({ search: "", isLeader: "", state: "", team: "" })
              }
            />
            <TeamPagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              isLoading={query.isFetching}
            />
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-9 space-y-3">
              <div className="grid gap-3 md:hidden">
                {query.isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <MobileTeamSkeletonCard key={i} />
                  ))
                ) : query.isError ? (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
                    Failed to load team members.
                  </div>
                ) : paged.length ? (
                  paged.map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() => openView(m)}
                      className="text-left w-full"
                    >
                      <MobileTeamCard member={m} />
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
                    No team members found.
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                <TableFrame>
                  <TeamTable
                    rows={paged}
                    isLoading={query.isLoading}
                    isError={query.isError}
                    onRowClick={openView}
                  />
                </TableFrame>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <PermissionGate permission={PERMISSIONS.VIEW_TEAMCATEGORIES}>
                <TeamCategoriesPanel />
              </PermissionGate>
            </div>
          </div>

          <TeamMemberSheet
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
            memberId={selected?._id}
            catId={
              selected
                ? typeof selected.teamCategory === "string"
                  ? selected.teamCategory
                  : selected.teamCategory?._id
                : undefined
            }
          />
        </div>
      </TableShell>
    </PermissionGate>
  );
}
