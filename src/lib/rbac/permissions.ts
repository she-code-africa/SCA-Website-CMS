// src/lib/rbac/permissions.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for permission keys and default role definitions.
// Used by:
//   - context/AuthContext.tsx       (to build mock users per role)
//   - hooks/usePermissions.ts       (Permission type)
//   - components/PermissionGate.tsx (Permission type)
//
// NOTE: This file is temporary mock infrastructure.
// When the backend ships RBAC, permissions will come from the /auth/me API
// response and this file will only retain the Permission type definition.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Permission type ─────────────────────────────────────────────────────────
// Using string so you don't need to maintain a giant union type.
// The real enforcement happens at the API level.
export type Permission = string;

// ─── All permission keys (from PDF) ─────────────────────────────────────────
export const ALL_PERMISSIONS: Permission[] = [
  // Dashboard
  "VIEW_DASHBOARD",
  "EXPORT_DASHBOARD_DATA",
  // Team
  "VIEW_TEAM",
  "CREATE_TEAM",
  "UPDATE_TEAM",
  "DELETE_TEAM",
  "EXPORT_TEAM",
  // Team Categories
  "VIEW_TEAMCATEGORIES",
  "CREATE_TEAMCATEGORIES",
  "UPDATE_TEAMCATEGORIES",
  "DELETE_TEAMCATEGORIES",
  // Volunteer Requests
  "VIEW_VOLUNTEER_REQUEST",
  "UPDATE_VOLUNTEER_REQUEST",
  "DELETE_VOLUNTEER_REQUEST",
  "EXPORT_VOLUNTEER_REQUEST",
  // Talent Requests
  "VIEW_TALENT_REQUEST",
  "UPDATE_TALENT_REQUEST",
  "DELETE_TALENT_REQUEST",
  "EXPORT_TALENT_REQUEST",
  // Enquiries
  "VIEW_ENQUIRY",
  "EXPORT_ENQUIRY",
  // Testimonials
  "VIEW_TESTIMONIALS",
  "CREATE_TESTIMONIALS",
  "UPDATE_TESTIMONIALS",
  "DELETE_TESTIMONIALS",
  "EXPORT_TESTIMONIALS",
  // Reports
  "VIEW_REPORT",
  "CREATE_REPORT",
  "UPDATE_REPORT",
  "DELETE_REPORT",
  // Events
  "VIEW_EVENT",
  "CREATE_EVENT",
  "UPDATE_EVENT",
  "DELETE_EVENT",
  // Chapters
  "VIEW_CHAPTER",
  "CREATE_CHAPTER",
  "UPDATE_CHAPTER",
  "DELETE_CHAPTER",
  // Chapter Categories
  "VIEW_CHAPTERCATEGORY",
  "CREATE_CHAPTERCATEGORY",
  "UPDATE_CHAPTERCATEGORY",
  "DELETE_CHAPTERCATEGORY",
  // Academy — Schools
  "VIEW_SCHOOL",
  "CREATE_SCHOOL",
  "UPDATE_SCHOOL",
  "DELETE_SCHOOL",
  // Academy — School Programs
  "VIEW_SCHOOLPROGRAM",
  "CREATE_SCHOOLPROGRAM",
  "UPDATE_SCHOOLPROGRAM",
  "DELETE_SCHOOLPROGRAM",
  // Academy — Courses
  "VIEW_COURSE",
  "CREATE_COURSE",
  "UPDATE_COURSE",
  "DELETE_COURSE",
  // Academy — Success Stories
  "VIEW_SUCCESS_STORY",
  "CREATE_SUCCESS_STORY",
  "UPDATE_SUCCESS_STORY",
  "DELETE_SUCCESS_STORY",
  // STEM-A-GIRL — Activities
  "VIEW_ACTIVITY",
  "CREATE_ACTIVITY",
  "UPDATE_ACTIVITY",
  "DELETE_ACTIVITY",
  // STEM-A-GIRL — Impact Stories
  "VIEW_IMPACT_STORIES",
  "CREATE_IMPACT_STORIES",
  "UPDATE_IMPACT_STORIES",
  "DELETE_IMPACT_STORIES",
  // Initiatives
  "VIEW_INITIATIVE",
  "CREATE_INITIATIVE",
  "UPDATE_INITIATIVE",
  "DELETE_INITIATIVE",
  // Partners
  "VIEW_PARTNER",
  "CREATE_PARTNER",
  "UPDATE_PARTNER",
  "DELETE_PARTNER",
  // Our Reach
  "VIEW_OUR_REACH",
  "CREATE_OUR_REACH",
  "UPDATE_OUR_REACH",
  "DELETE_OUR_REACH",
  // Users
  "VIEW_USER",
  "CREATE_USER",
  "UPDATE_USER",
  "DELETE_USER",
  // Roles
  "VIEW_ROLE",
  "CREATE_ROLE",
  "UPDATE_ROLE",
  "DELETE_ROLE",
  // Jobs
  "VIEW_JOB",
  "CREATE_JOB",
  "UPDATE_JOB",
  "DELETE_JOB",
  // Companies
  "VIEW_COMPANY",
  "CREATE_COMPANY",
  "UPDATE_COMPANY",
  "DELETE_COMPANY",
  // Job Types
  "VIEW_JOBTYPE",
  "CREATE_JOBTYPE",
  "UPDATE_JOBTYPE",
  "DELETE_JOBTYPE"
];

// ─── Default role definitions ─────────────────────────────────────────────────
// Used by AuthContext to build a mock user for the current session.
// Exact permission sets sourced from SCA_ROLE_X_PERMISSION_MAPPING PDF.

export const DEFAULT_ROLES = [
  {
    id: "role_administrator",
    name: "Administrator",
    description: "Full unrestricted access to all modules and actions.",
    isDefault: true,
    permissions: ALL_PERMISSIONS
  },
  {
    id: "role_program_manager",
    name: "Program Manager",
    description:
      "Manages programs, events, and initiatives. No user or role admin access.",
    isDefault: true,
    permissions: [
      "VIEW_DASHBOARD",
      "EXPORT_DASHBOARD_DATA",
      "VIEW_TEAM",
      "VIEW_TEAMCATEGORIES",
      "VIEW_VOLUNTEER_REQUEST",
      "UPDATE_VOLUNTEER_REQUEST",
      "DELETE_VOLUNTEER_REQUEST",
      "EXPORT_VOLUNTEER_REQUEST",
      "VIEW_TALENT_REQUEST",
      "VIEW_ENQUIRY",
      "EXPORT_ENQUIRY",
      "VIEW_TESTIMONIALS",
      "EXPORT_TESTIMONIALS",
      "VIEW_REPORT",
      "CREATE_REPORT",
      "VIEW_EVENT",
      "CREATE_EVENT",
      "UPDATE_EVENT",
      "DELETE_EVENT",
      "VIEW_CHAPTER",
      "CREATE_CHAPTER",
      "UPDATE_CHAPTER",
      "DELETE_CHAPTER",
      "VIEW_CHAPTERCATEGORY",
      "CREATE_CHAPTERCATEGORY",
      "UPDATE_CHAPTERCATEGORY",
      "DELETE_CHAPTERCATEGORY",
      "VIEW_SCHOOL",
      "CREATE_SCHOOL",
      "UPDATE_SCHOOL",
      "DELETE_SCHOOL",
      "VIEW_SCHOOLPROGRAM",
      "CREATE_SCHOOLPROGRAM",
      "UPDATE_SCHOOLPROGRAM",
      "DELETE_SCHOOLPROGRAM",
      "VIEW_COURSE",
      "CREATE_COURSE",
      "UPDATE_COURSE",
      "DELETE_COURSE",
      "VIEW_SUCCESS_STORY",
      "CREATE_SUCCESS_STORY",
      "UPDATE_SUCCESS_STORY",
      "DELETE_SUCCESS_STORY",
      "VIEW_ACTIVITY",
      "CREATE_ACTIVITY",
      "UPDATE_ACTIVITY",
      "DELETE_ACTIVITY",
      "VIEW_IMPACT_STORIES",
      "CREATE_IMPACT_STORIES",
      "UPDATE_IMPACT_STORIES",
      "DELETE_IMPACT_STORIES",
      "VIEW_INITIATIVE",
      "CREATE_INITIATIVE",
      "UPDATE_INITIATIVE",
      "DELETE_INITIATIVE",
      "VIEW_PARTNER",
      "CREATE_PARTNER",
      "UPDATE_PARTNER",
      "DELETE_PARTNER",
      "VIEW_OUR_REACH",
      "CREATE_OUR_REACH",
      "UPDATE_OUR_REACH",
      "DELETE_OUR_REACH",
      "VIEW_USER",
      "VIEW_JOB",
      "VIEW_COMPANY",
      "VIEW_JOBTYPE"
    ] as Permission[]
  },
  {
    id: "role_viewer",
    name: "Viewer",
    description: "Read-only access across all modules.",
    isDefault: true,
    permissions: [
      "VIEW_DASHBOARD",
      "VIEW_TEAM",
      "VIEW_TEAMCATEGORIES",
      "VIEW_VOLUNTEER_REQUEST",
      "VIEW_TALENT_REQUEST",
      "VIEW_ENQUIRY",
      "VIEW_TESTIMONIALS",
      "VIEW_REPORT",
      "VIEW_EVENT",
      "VIEW_CHAPTER",
      "VIEW_CHAPTERCATEGORY",
      "VIEW_SCHOOL",
      "VIEW_SCHOOLPROGRAM",
      "VIEW_COURSE",
      "VIEW_SUCCESS_STORY",
      "VIEW_ACTIVITY",
      "VIEW_IMPACT_STORIES",
      "VIEW_INITIATIVE",
      "VIEW_PARTNER",
      "VIEW_OUR_REACH",
      "VIEW_USER",
      "VIEW_ROLE",
      "VIEW_JOB",
      "VIEW_COMPANY",
      "VIEW_JOBTYPE"
    ] as Permission[]
  },
  {
    id: "role_auditor",
    name: "Auditor",
    description:
      "Read and export access for compliance and reporting purposes.",
    isDefault: true,
    permissions: [
      "VIEW_DASHBOARD",
      "EXPORT_DASHBOARD_DATA",
      "VIEW_TEAM",
      "EXPORT_TEAM",
      "VIEW_TEAMCATEGORIES",
      "VIEW_VOLUNTEER_REQUEST",
      "EXPORT_VOLUNTEER_REQUEST",
      "VIEW_TALENT_REQUEST",
      "EXPORT_TALENT_REQUEST",
      "VIEW_ENQUIRY",
      "EXPORT_ENQUIRY",
      "VIEW_TESTIMONIALS",
      "EXPORT_TESTIMONIALS",
      "VIEW_REPORT",
      "VIEW_EVENT",
      "VIEW_CHAPTER",
      "VIEW_CHAPTERCATEGORY",
      "VIEW_SCHOOL",
      "VIEW_SCHOOLPROGRAM",
      "VIEW_COURSE",
      "VIEW_SUCCESS_STORY",
      "VIEW_ACTIVITY",
      "VIEW_IMPACT_STORIES",
      "VIEW_INITIATIVE",
      "VIEW_PARTNER",
      "VIEW_OUR_REACH",
      "VIEW_USER",
      "VIEW_ROLE",
      "VIEW_JOB",
      "VIEW_COMPANY",
      "VIEW_JOBTYPE"
    ] as Permission[]
  }
] as const;
