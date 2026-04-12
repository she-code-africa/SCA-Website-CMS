// // src/features/roles/mock.ts
// // ─────────────────────────────────────────────────────────────────────────────
// // UI-specific data for the Roles & Permissions page.
// //
// // Permission keys and role definitions live in lib/rbac/permissions.ts.
// // This file only contains:
// //   - PERMISSION_MODULES  → drives the matrix table rows in role-sheet.tsx
// //   - ACTION_COLUMNS/LABELS → drives the matrix column headers
// //   - Mock CRUD store for the roles list (used by api.ts)
// // ─────────────────────────────────────────────────────────────────────────────

// import type { RoleDetail } from "./types";
// import { ALL_PERMISSIONS, DEFAULT_ROLES } from "@/lib/rbac/permissions";

// // Re-export so role-sheet.tsx can still import ALL_PERMISSIONS from here
// export { ALL_PERMISSIONS };

// // ─── Permission modules — drives the matrix UI rows ──────────────────────────

// export interface PermissionModule {
//   key: string;
//   label: string;
//   permissions: string[];
// }

// export const PERMISSION_MODULES: PermissionModule[] = [
//   {
//     key: "dashboard",
//     label: "Dashboard & Reports",
//     permissions: ["VIEW_DASHBOARD", "EXPORT_DASHBOARD_DATA"]
//   },
//   {
//     key: "team",
//     label: "Team",
//     permissions: [
//       "VIEW_TEAM",
//       "CREATE_TEAM",
//       "UPDATE_TEAM",
//       "DELETE_TEAM",
//       "EXPORT_TEAM"
//     ]
//   },
//   {
//     key: "teamCategories",
//     label: "Team Categories",
//     permissions: [
//       "VIEW_TEAMCATEGORIES",
//       "CREATE_TEAMCATEGORIES",
//       "UPDATE_TEAMCATEGORIES",
//       "DELETE_TEAMCATEGORIES"
//     ]
//   },
//   {
//     key: "volunteerReq",
//     label: "Volunteer Requests",
//     permissions: [
//       "VIEW_VOLUNTEER_REQUEST",
//       "UPDATE_VOLUNTEER_REQUEST",
//       "DELETE_VOLUNTEER_REQUEST",
//       "EXPORT_VOLUNTEER_REQUEST"
//     ]
//   },
//   {
//     key: "talentReq",
//     label: "Talent Requests",
//     permissions: [
//       "VIEW_TALENT_REQUEST",
//       "UPDATE_TALENT_REQUEST",
//       "DELETE_TALENT_REQUEST",
//       "EXPORT_TALENT_REQUEST"
//     ]
//   },
//   {
//     key: "enquiries",
//     label: "Enquiries",
//     permissions: ["VIEW_ENQUIRY", "EXPORT_ENQUIRY"]
//   },
//   {
//     key: "testimonials",
//     label: "Testimonials",
//     permissions: [
//       "VIEW_TESTIMONIALS",
//       "CREATE_TESTIMONIALS",
//       "UPDATE_TESTIMONIALS",
//       "DELETE_TESTIMONIALS",
//       "EXPORT_TESTIMONIALS"
//     ]
//   },
//   {
//     key: "reports",
//     label: "Annual Reports",
//     permissions: [
//       "VIEW_REPORT",
//       "CREATE_REPORT",
//       "UPDATE_REPORT",
//       "DELETE_REPORT"
//     ]
//   },
//   {
//     key: "events",
//     label: "Events",
//     permissions: ["VIEW_EVENT", "CREATE_EVENT", "UPDATE_EVENT", "DELETE_EVENT"]
//   },
//   {
//     key: "chapters",
//     label: "Chapters",
//     permissions: [
//       "VIEW_CHAPTER",
//       "CREATE_CHAPTER",
//       "UPDATE_CHAPTER",
//       "DELETE_CHAPTER"
//     ]
//   },

//   {
//     key: "chapterEvents",
//     label: "Chapter Events",
//     permissions: ["VIEW_EVENT", "CREATE_EVENT", "UPDATE_EVENT", "DELETE_EVENT"]
//   },
//   {
//     key: "chapterCats",
//     label: "Chapter Categories",
//     permissions: [
//       "VIEW_CHAPTERCATEGORY",
//       "CREATE_CHAPTERCATEGORY",
//       "UPDATE_CHAPTERCATEGORY",
//       "DELETE_CHAPTERCATEGORY"
//     ]
//   },
//   {
//     key: "schools",
//     label: "Academy — Schools",
//     permissions: [
//       "VIEW_SCHOOL",
//       "CREATE_SCHOOL",
//       "UPDATE_SCHOOL",
//       "DELETE_SCHOOL"
//     ]
//   },
//   {
//     key: "schoolPrograms",
//     label: "Academy — School Programs",
//     permissions: [
//       "VIEW_SCHOOLPROGRAM",
//       "CREATE_SCHOOLPROGRAM",
//       "UPDATE_SCHOOLPROGRAM",
//       "DELETE_SCHOOLPROGRAM"
//     ]
//   },
//   {
//     key: "courses",
//     label: "Academy — Courses",
//     permissions: [
//       "VIEW_COURSE",
//       "CREATE_COURSE",
//       "UPDATE_COURSE",
//       "DELETE_COURSE"
//     ]
//   },
//   {
//     key: "successStories",
//     label: "Academy — Success Stories",
//     permissions: [
//       "VIEW_SUCCESS_STORY",
//       "CREATE_SUCCESS_STORY",
//       "UPDATE_SUCCESS_STORY",
//       "DELETE_SUCCESS_STORY"
//     ]
//   },
//   {
//     key: "activities",
//     label: "STEM-A-GIRL — Activities",
//     permissions: [
//       "VIEW_ACTIVITY",
//       "CREATE_ACTIVITY",
//       "UPDATE_ACTIVITY",
//       "DELETE_ACTIVITY"
//     ]
//   },
//   {
//     key: "impactStories",
//     label: "STEM-A-GIRL — Impact Stories",
//     permissions: [
//       "VIEW_IMPACT_STORIES",
//       "CREATE_IMPACT_STORIES",
//       "UPDATE_IMPACT_STORIES",
//       "DELETE_IMPACT_STORIES"
//     ]
//   },
//   {
//     key: "initiatives",
//     label: "Initiatives",
//     permissions: [
//       "VIEW_INITIATIVE",
//       "CREATE_INITIATIVE",
//       "UPDATE_INITIATIVE",
//       "DELETE_INITIATIVE"
//     ]
//   },
//   {
//     key: "partners",
//     label: "Partners",
//     permissions: [
//       "VIEW_PARTNER",
//       "CREATE_PARTNER",
//       "UPDATE_PARTNER",
//       "DELETE_PARTNER"
//     ]
//   },
//   {
//     key: "ourReach",
//     label: "Our Reach",
//     permissions: [
//       "VIEW_OUR_REACH",
//       "CREATE_OUR_REACH",
//       "UPDATE_OUR_REACH",
//       "DELETE_OUR_REACH"
//     ]
//   },
//   {
//     key: "users",
//     label: "User Management",
//     permissions: ["VIEW_USER", "CREATE_USER", "UPDATE_USER", "DELETE_USER"]
//   },
//   {
//     key: "roles",
//     label: "Roles",
//     permissions: ["VIEW_ROLE", "CREATE_ROLE", "UPDATE_ROLE", "DELETE_ROLE"]
//   },
//   {
//     key: "jobs",
//     label: "Jobs",
//     permissions: ["VIEW_JOB", "CREATE_JOB", "UPDATE_JOB", "DELETE_JOB"]
//   },
//   {
//     key: "companies",
//     label: "Companies",
//     permissions: [
//       "VIEW_COMPANY",
//       "CREATE_COMPANY",
//       "UPDATE_COMPANY",
//       "DELETE_COMPANY"
//     ]
//   },
//   {
//     key: "jobTypes",
//     label: "Job Types",
//     permissions: [
//       "VIEW_JOBTYPE",
//       "CREATE_JOBTYPE",
//       "UPDATE_JOBTYPE",
//       "DELETE_JOBTYPE"
//     ]
//   },
//   {
//     key: "media",
//     label: "Media & Activities",
//     permissions: [
//       "VIEW_ACTIVITY",
//       "CREATE_ACTIVITY",
//       "UPDATE_ACTIVITY",
//       "DELETE_ACTIVITY"
//     ]
//   }
// ];

// // ─── Action column config — drives the matrix column headers ─────────────────

// export const ACTION_COLUMNS = [
//   "VIEW",
//   "CREATE",
//   "UPDATE",
//   "DELETE",
//   "EXPORT"
// ] as const;

// export const ACTION_LABELS: Record<string, string> = {
//   VIEW: "View",
//   CREATE: "Create",
//   UPDATE: "Edit",
//   DELETE: "Delete",
//   EXPORT: "Export"
// };

// // ─── Mock roles store ─────────────────────────────────────────────────────────
// // Built directly from DEFAULT_ROLES in lib/rbac/permissions.ts.
// // No more duplicated permission arrays here.

// const USER_COUNTS: Record<string, number> = {
//   role_administrator: 1,
//   role_program_manager: 3,
//   role_viewer: 2,
//   role_auditor: 2
// };

// let _roles: RoleDetail[] = DEFAULT_ROLES.map((r) => ({
//   id: r.id,
//   name: r.name,
//   description: r.description,
//   isDefault: r.isDefault,
//   permissions: [...r.permissions],
//   usersCount: USER_COUNTS[r.id] ?? 0,
//   createdAt: "2024-01-01T00:00:00Z"
// }));

// export function getMockRoles(): RoleDetail[] {
//   return [..._roles];
// }

// export function setMockRoles(roles: RoleDetail[]): void {
//   _roles = roles;
// }

// export const getPermissionByAction = (
//   permissions: string[],
//   action: string
// ) => {
//   // Matches "VIEW_TEAM" or "TEAM_VIEW" or "VIEW_DASHBOARD"
//   return permissions.find(
//     (p) =>
//       p.startsWith(`${action}_`) || p.endsWith(`_${action}`) || p === action // edge case
//   );
// };

// if (process.env.NODE_ENV === "development") {
//   const flattenedModules = PERMISSION_MODULES.flatMap((m) => m.permissions);
//   const missingInModules = ALL_PERMISSIONS.filter(
//     (p) => !flattenedModules.includes(p)
//   );

//   if (missingInModules.length > 0) {
//     console.warn(
//       "RBAC Warning: Some permissions are not assigned to any UI Module:",
//       missingInModules
//     );
//   }
// }