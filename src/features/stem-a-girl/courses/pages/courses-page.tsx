// // src/features/stem-a-girl/courses/pages/courses-page.tsx

// "use client";

// import * as React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getCourses } from "../api";
// import { getSAGActivities } from "@/features/stem-a-girl/activities/api";
// import type { Course, CourseFilters } from "../types";
// import type { SAGActivity } from "@/features/stem-a-girl/activities/types";
// import { CoursesTable } from "../components/courses-table";
// import { CourseSheet } from "../components/course-sheet";
// import { TableShell } from "@/components/templates/table-shell";
// import { TableFrame } from "@/components/templates/table-frame";
// import { CoursesFilters } from "../components/courses-filters";
// import { CoursesPagination } from "../components/courses-pagination";
// import { MobileCourseCard } from "../components/mobile-course-card";
// import { MobileCourseSkeletonCard } from "../components/mobile-course-skeleton-card";

// // 👇 Import PermissionGate and permissions
// import { PermissionGate } from "@/components/PermissionGate";
// import { PERMISSIONS } from "@/lib/rbac/permissions";

// function applyFilters(rows: Course[], filters: CourseFilters) {
//   let out = [...rows];
//   const search = filters.search?.trim().toLowerCase();
//   if (search) {
//     out = out.filter(
//       (c) =>
//         c.title.toLowerCase().includes(search) ||
//         c.description.toLowerCase().includes(search)
//     );
//   }
//   if (filters.state) out = out.filter((c) => c.state === filters.state);
//   return out;
// }

// export default function CoursesPage() {
//   const [filters, setFilters] = React.useState<CourseFilters>({
//     search: "",
//     state: "",
//     sortBy: ""
//   });
//   const [page, setPage] = React.useState(1);
//   const limit = 10;
//   const [sheetOpen, setSheetOpen] = React.useState(false);
//   const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
//   const [selectedId, setSelectedId] = React.useState<string | null>(null);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["courses"],
//     queryFn: getCourses,
//     staleTime: 30_000
//   });

//   const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
//     queryKey: ["sag-activities"],
//     queryFn: () => getSAGActivities({}),
//     staleTime: 60_000
//   });

//   const courses = React.useMemo(
//     () => (Array.isArray(data) ? data : []),
//     [data]
//   );
//   const activities = React.useMemo(
//     () => (activitiesData as SAGActivity[]) ?? [],
//     [activitiesData]
//   );

//   const activityMap = React.useMemo(() => {
//     const map = new Map<string, string>();
//     activities.forEach((act) => {
//       map.set(act._id, act.title);
//     });
//     return map;
//   }, [activities]);

//   const filtered = React.useMemo(
//     () => applyFilters(courses, filters),
//     [courses, filters]
//   );
//   const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
//   const paged = filtered.slice((page - 1) * limit, page * limit);

//   React.useEffect(() => {
//     const handleAdd = () => {
//       setSelectedId(null);
//       setSheetMode("create");
//       setSheetOpen(true);
//     };
//     window.addEventListener("sag-course:add", handleAdd);
//     return () => window.removeEventListener("sag-course:add", handleAdd);
//   }, []);

//   const openView = (c: Course) => {
//     setSelectedId(c._id);
//     setSheetMode("view");
//     setSheetOpen(true);
//   };
//   const openEdit = (c: Course) => {
//     setSelectedId(c._id);
//     setSheetMode("view");
//     setSheetOpen(true);
//   };

//   const isLoadingAny = isLoading || isLoadingActivities;

//   return (
//     <PermissionGate
//       permission={PERMISSIONS.VIEW_SAG_COURSE}
//       fallback={
//         <div className="p-8 text-center">
//           You do not have permission to view this page.
//         </div>
//       }
//     >
//       <TableShell
//         title="Courses"
//         description="Manage Stem-a-Girl courses."
//         right={
//           <div className="text-sm text-muted-foreground">
//             {isLoadingAny ? "Loading…" : `${filtered.length} course(s)`}
//           </div>
//         }
//       >
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <CoursesFilters
//               value={filters}
//               onChange={setFilters}
//               onReset={() => setFilters({ search: "", state: "", sortBy: "" })}
//             />
//           </div>
//           <div className="flex justify-end">
//             <CoursesPagination
//               currentPage={page}
//               totalPages={totalPages}
//               onPrevious={() => setPage((p) => Math.max(1, p - 1))}
//               onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
//               isLoading={isLoadingAny}
//             />
//           </div>

//           {/* Mobile */}
//           <div className="grid gap-3 md:hidden">
//             {isLoadingAny ? (
//               Array.from({ length: 6 }).map((_, i) => (
//                 <MobileCourseSkeletonCard key={i} />
//               ))
//             ) : isError ? (
//               <div className="text-center text-red-500">
//                 Failed to load courses
//               </div>
//             ) : paged.length ? (
//               paged.map((c) => (
//                 <button
//                   key={c._id}
//                   onClick={() => openView(c)}
//                   className="text-left w-full"
//                 >
//                   <MobileCourseCard course={c} activityMap={activityMap} />
//                 </button>
//               ))
//             ) : (
//               <div className="text-center text-muted-foreground">
//                 No courses found
//               </div>
//             )}
//           </div>

//           {/* Desktop */}
//           <div className="hidden md:block">
//             <TableFrame>
//               <CoursesTable
//                 rows={paged}
//                 isLoading={isLoadingAny}
//                 isError={isError}
//                 onView={openView}
//                 onEdit={openEdit}
//                 activityMap={activityMap}
//               />
//             </TableFrame>
//           </div>

//           <CourseSheet
//             open={sheetOpen}
//             onOpenChange={setSheetOpen}
//             mode={sheetMode}
//             courseId={selectedId || undefined}
//           />
//         </div>
//       </TableShell>
//     </PermissionGate>
//   );
// }




//the above code is the code with permission gate, once backend adds the necessary permissions to this page, you can uncomment the above and delete the below



"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../api";
import { getSAGActivities } from "@/features/stem-a-girl/activities/api";
import type { Course, CourseFilters } from "../types";
import type { SAGActivity } from "@/features/stem-a-girl/activities/types";
import { CoursesTable } from "../components/courses-table";
import { CourseSheet } from "../components/course-sheet";
import { TableShell } from "@/components/templates/table-shell";
import { TableFrame } from "@/components/templates/table-frame";
import { CoursesFilters } from "../components/courses-filters";
import { CoursesPagination } from "../components/courses-pagination";
import { MobileCourseCard } from "../components/mobile-course-card";
import { MobileCourseSkeletonCard } from "../components/mobile-course-skeleton-card";

function applyFilters(rows: Course[], filters: CourseFilters) {
  let out = [...rows];
  const search = filters.search?.trim().toLowerCase();
  if (search) {
    out = out.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
    );
  }
  if (filters.state) out = out.filter((c) => c.state === filters.state);
  return out;
}

export default function CoursesPage() {
  const [filters, setFilters] = React.useState<CourseFilters>({
    search: "",
    state: "",
    sortBy: ""
  });
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "view">("create");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    staleTime: 30_000
  });

  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["sag-activities"],
    queryFn: () => getSAGActivities({}),
    staleTime: 60_000
  });

  const courses = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );
  const activities = React.useMemo(
    () => (activitiesData as SAGActivity[]) ?? [],
    [activitiesData]
  );

  const activityMap = React.useMemo(() => {
    const map = new Map<string, string>();
    activities.forEach((act) => {
      map.set(act._id, act.title);
    });
    return map;
  }, [activities]);

  const filtered = React.useMemo(
    () => applyFilters(courses, filters),
    [courses, filters]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  React.useEffect(() => {
    const handleAdd = () => {
      setSelectedId(null);
      setSheetMode("create");
      setSheetOpen(true);
    };
    window.addEventListener("sag-course:add", handleAdd);
    return () => window.removeEventListener("sag-course:add", handleAdd);
  }, []);

  const openView = (c: Course) => {
    setSelectedId(c._id);
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (c: Course) => {
    setSelectedId(c._id);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const isLoadingAny = isLoading || isLoadingActivities;

  return (
    <TableShell
      title="Courses"
      description="Manage Stem-a-Girl courses."
      right={
        <div className="text-sm text-muted-foreground">
          {isLoadingAny ? "Loading…" : `${filtered.length} course(s)`}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <CoursesFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: "", state: "", sortBy: "" })}
          />
        </div>
        <div className="flex justify-end">
          <CoursesPagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            isLoading={isLoadingAny}
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-3 md:hidden">
          {isLoadingAny ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MobileCourseSkeletonCard key={i} />
            ))
          ) : isError ? (
            <div className="text-center text-red-500">Failed to load courses</div>
          ) : paged.length ? (
            paged.map((c) => (
              <button
                key={c._id}
                onClick={() => openView(c)}
                className="text-left w-full"
              >
                <MobileCourseCard course={c} activityMap={activityMap} />
              </button>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No courses found</div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <TableFrame>
            <CoursesTable
              rows={paged}
              isLoading={isLoadingAny}
              isError={isError}
              onView={openView}
              onEdit={openEdit}
              activityMap={activityMap}
            />
          </TableFrame>
        </div>

        <CourseSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheetMode}
          courseId={selectedId || undefined}
        />
      </div>
    </TableShell>
  );
}