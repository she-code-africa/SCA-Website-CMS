// "use client";

// import * as React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { PermissionGate } from "@/components/PermissionGate";
// import { PERMISSIONS } from "@/lib/rbac/permissions";
// import { getJobs } from "@/features/jobs/api";
// import type { Job, JobFilters } from "@/features/jobs/types";
// import { JobFilters as Filters } from "@/features/jobs/components/job-filters";
// import { JobTable } from "@/features/jobs/components/job-table";
// import { MobileJobCard } from "@/features/jobs/components/mobile-job-card";
// import { MobileJobSkeletonCard } from "@/features/jobs/components/mobile-job-skeleton-card";
// import { JobSheet } from "@/features/jobs/components/job-sheet";
// import { JobPagination } from "@/features/jobs/components/job-pagination";
// import { JobCategoriesPanel } from "@/features/jobs/components/job-categories-panel";
// import { JobTypesPanel } from "@/features/jobs/components/job-types-panel";
// import { TableShell } from "@/components/templates/table-shell";
// import { TableFrame } from "@/components/templates/table-frame";

// function extractId(val: string | { _id: string } | null | undefined): string {
//   if (!val) return "";
//   if (typeof val === "string") return val;
//   return val._id || "";
// }

// function applyClientFilters(rows: Job[], f: JobFilters) {
//   let out = [...rows];
//   const q = f.search?.trim().toLowerCase();
//   if (q) out = out.filter((j) => j.title?.toLowerCase().includes(q));
//   if (f.state) out = out.filter((j) => j.state === f.state);
//   if (f.jobType && f.jobType !== "")
//     out = out.filter((j) => extractId(j.jobType) === f.jobType);
//   if (f.jobCategory && f.jobCategory !== "")
//     out = out.filter((j) => extractId(j.jobCategory) === f.jobCategory);
//   if (f.sortBy) {
//     const key = f.sortBy;
//     out.sort((a, b) => {
//       const av = a?.[key];
//       const bv = b?.[key];
//       if (key === "createdAt" || key === "updatedAt" || key === "deadline") {
//         return new Date(bv ?? 0).getTime() - new Date(av ?? 0).getTime();
//       }
//       return String(av ?? "").localeCompare(String(bv ?? ""));
//     });
//   } else {
//     out.sort(
//       (a, b) =>
//         new Date(b.createdAt ?? 0).getTime() -
//         new Date(a.createdAt ?? 0).getTime()
//     );
//   }
//   return out;
// }

// export default function JobsPage() {
//   const [filters, setFilters] = React.useState<JobFilters>({
//     search: "",
//     state: "",
//     jobType: "",
//     jobCategory: "",
//     sortBy: ""
//   });
//   const [page, setPage] = React.useState(1);
//   const limit = 10;
//   const [modalOpen, setModalOpen] = React.useState(false);
//   const [modalMode, setModalMode] = React.useState<"create" | "view">("create");
//   const [selected, setSelected] = React.useState<Job | null>(null);

//   React.useEffect(() => {
//     if (typeof window === "undefined") return;
//     const handler = () => {
//       setSelected(null);
//       setModalMode("create");
//       setModalOpen(true);
//     };
//     window.addEventListener("job:add", handler);
//     return () => window.removeEventListener("job:add", handler);
//   }, []);

//   React.useEffect(() => {
//     setPage(1);
//   }, [
//     filters.search,
//     filters.state,
//     filters.jobType,
//     filters.jobCategory,
//     filters.sortBy
//   ]);

//   const query = useQuery({
//     queryKey: ["jobs"],
//     queryFn: getJobs,
//     staleTime: 30_000
//   });

//   const rows = React.useMemo(
//     () => applyClientFilters((query.data ?? []) as Job[], filters),
//     [query.data, filters]
//   );
//   const totalPages = Math.max(1, Math.ceil(rows.length / limit));
//   const paged = rows.slice((page - 1) * limit, page * limit);

//   const openView = (j: Job) => {
//     setSelected(j);
//     setModalMode("view");
//     setModalOpen(true);
//   };

//   const openEdit = (j: Job) => {
//     // The sheet has an Edit button inside, so we open in view mode
//     setSelected(j);
//     setModalMode("view");
//     setModalOpen(true);
//   };

//   return (
//     <PermissionGate permission={PERMISSIONS.VIEW_JOB}>
//       <TableShell
//         title="Jobs"
//         description="Manage job postings, categories, and job types."
//         right={
//           <div className="text-sm text-muted-foreground">
//             {query.isLoading ? "Loading…" : `${rows.length} job(s)`}
//           </div>
//         }
//       >
//         <div className="space-y-4">
//           <div className="grid grid-cols-12 gap-4">
//             <div className="col-span-12 lg:col-span-9 space-y-3">
//               <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                 <Filters
//                   value={filters}
//                   onChange={setFilters}
//                   onReset={() =>
//                     setFilters({
//                       search: "",
//                       state: "",
//                       jobType: "",
//                       jobCategory: "",
//                       sortBy: ""
//                     })
//                   }
//                 />
//                 <JobPagination
//                   currentPage={page}
//                   totalPages={totalPages}
//                   onPrevious={() => setPage((p) => Math.max(1, p - 1))}
//                   onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
//                   isLoading={query.isFetching}
//                 />
//               </div>

//               <div className="grid gap-3 md:hidden">
//                 {query.isLoading ? (
//                   Array.from({ length: 6 }).map((_, i) => (
//                     <MobileJobSkeletonCard key={`job-skeleton-${i}`} />
//                   ))
//                 ) : query.isError ? (
//                   <div className="rounded-xl border bg-background p-6 text-center text-sm text-red-500">
//                     Failed to load jobs.
//                   </div>
//                 ) : paged.length ? (
//                   paged.map((j) => (
//                     <button
//                       key={j._id}
//                       type="button"
//                       onClick={() => openView(j)}
//                       className="text-left w-full"
//                     >
//                       <MobileJobCard job={j} />
//                     </button>
//                   ))
//                 ) : (
//                   <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
//                     No jobs found.
//                   </div>
//                 )}
//               </div>

//               <div className="hidden md:block">
//                 <TableFrame>
//                   <JobTable
//                     rows={paged}
//                     isLoading={query.isLoading}
//                     isError={query.isError}
//                     onView={openView}
//                     onEdit={openEdit}
//                   />
//                 </TableFrame>
//               </div>
//             </div>

//             <div className="col-span-12 lg:col-span-3 space-y-4">
//               <JobCategoriesPanel />
//               <JobTypesPanel />
//             </div>
//           </div>
//           <JobSheet
//             open={modalOpen}
//             onOpenChange={setModalOpen}
//             mode={modalMode}
//             jobId={selected?._id}
//           />
//         </div>
//       </TableShell>
//     </PermissionGate>
//   );
// }



// ────────────────────────────────────────────────────────────────────────────
// TODO: Uncomment the above code and the dynamic implementation when
//       the job functionality is fully implemented on the backend.
//       The below placeholder is temporary to avoid permission-related 401 errors.
// ────────────────────────────────────────────────────────────────────────────
// "use client";

// import { TableShell } from "@/components/templates/table-shell";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Briefcase, Clock } from "lucide-react";


// export default function JobsPage() {
//   // ──────────────────────────────────────────────────────────────────────────
//   // Placeholder: Static "Coming Soon" message – no API calls, no permission checks.
//   // When the backend is ready, replace everything inside this component
//   // with the commented dynamic code below.
//   // ──────────────────────────────────────────────────────────────────────────
//   return (
//     <TableShell
//       title="Jobs"
//       description="Manage job postings, categories, and job types."
//     >
//       <Card className="border-dashed bg-muted/20 max-w-2xl mx-auto mt-12">
//         <CardHeader className="text-center">
//           <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
//             <Briefcase className="h-8 w-8 text-muted-foreground" />
//           </div>
//           <CardTitle className="text-2xl">Job Posting Coming Soon</CardTitle>
//         </CardHeader>
//         <CardContent className="text-center text-muted-foreground space-y-2">
//           <p>
//             The job management feature is currently under development.
//           </p>
//           <p className="text-sm">
//             It will be available in a future release of the CMS.
//           </p>
//           <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70 pt-4">
//             <Clock className="h-3.5 w-3.5" />
//             <span>Estimated completion: later this year</span>
//           </div>
//         </CardContent>
//       </Card>
//     </TableShell>
//   );
// }

"use client";

import { TableShell } from "@/components/templates/table-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Clock,
  Mail,
  AlertCircle,
  Construction
} from "lucide-react";

export default function JobsPage() {
  return (
    <TableShell
      title="Jobs"
      description="Manage job postings, categories, and job types."
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-2xl border border-muted shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="text-center space-y-4">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 border border-muted">
                <Construction className="h-12 w-12 text-primary/60" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Job Management
            </CardTitle>
            <p className="text-base text-muted-foreground">
              This feature is currently under construction
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="rounded-lg bg-muted/30 p-4 border">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The job posting functionality is being rebuilt to align with our
                new backend infrastructure. We expect to have it fully
                operational later this year.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-left bg-muted/20 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Why is this happening?</p>
                  <p className="text-xs text-muted-foreground">
                    Recent permission updates on the backend require full
                    refactoring of the job module. We’re prioritising stability
                    and security before re‑enabling this feature.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    Need to post a job urgently?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please contact the super admin or send an email to{" "}
                    <strong>support@shecodeafrica.org</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Expected timeline</p>
                  <p className="text-xs text-muted-foreground">
                    Implementation is scheduled for Q3–Q4 2025. We’ll notify you
                    via the dashboard when it’s ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground/70 flex justify-center gap-4 pt-2">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70"></div>{" "}
                Refactoring in progress
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>{" "}
                Coming soon
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </TableShell>
  );
}
