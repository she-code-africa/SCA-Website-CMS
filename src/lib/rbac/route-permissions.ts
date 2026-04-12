// src/lib/rbac/route-permissions.ts
import { PERMISSIONS } from "./permissions";

export const routePermissions: Record<string, string> = {
  // Dashboard
  "/admin/dashboard": PERMISSIONS.VIEW_DASHBOARD,

  // Settings
  "/admin/settings/users": PERMISSIONS.VIEW_USER,
  "/admin/settings/roles": PERMISSIONS.VIEW_ROLE,
  "/admin/settings/reach": PERMISSIONS.VIEW_OUR_REACH,

  // Team
  "/admin/team": PERMISSIONS.VIEW_TEAM,

  // Chapters
  "/admin/chapters": PERMISSIONS.VIEW_CHAPTER,
  "/admin/chapters/chapter-events": PERMISSIONS.VIEW_EVENT,
  "/admin/chapters/chapter-leads": PERMISSIONS.VIEW_TEAM,

  // Events
  "/admin/events": PERMISSIONS.VIEW_EVENT,

  // Initiatives
  "/admin/initiatives": PERMISSIONS.VIEW_INITIATIVE,

  // Partners
  "/admin/partners": PERMISSIONS.VIEW_PARTNER,

  // Reports
  "/admin/reports": PERMISSIONS.VIEW_REPORT,

  // Testimonials
  "/admin/testimonials": PERMISSIONS.VIEW_TESTIMONIALS,
  // "/admin/testimonials": PERMISSIONS.manage_testimonials,

  // Enquiries
  "/admin/enquiries": PERMISSIONS.VIEW_ENQUIRY,

  // Talent Request
  "/admin/talent-request": PERMISSIONS.VIEW_TALENT_REQUEST,

  // Volunteers
  "/admin/volunteers": PERMISSIONS.VIEW_VOLUNTEER_REQUEST,
  "/admin/volunteers/requests": PERMISSIONS.VIEW_VOLUNTEER_REQUEST,
  "/admin/volunteers/roles": PERMISSIONS.VIEW_VOLUNTEER_REQUEST,

  // Jobs & Companies
  "/admin/jobs": PERMISSIONS.VIEW_JOB,
  "/admin/companies": PERMISSIONS.VIEW_COMPANY,

  // Media
  // "/admin/media": PERMISSIONS.VIEW_MEDIA, // make sure PERMISSIONS has VIEW_MEDIA

  // Academy
  "/admin/academy/courses": PERMISSIONS.VIEW_COURSE,
  "/admin/academy/schools": PERMISSIONS.VIEW_SCHOOL,
  "/admin/academy/school-programs": PERMISSIONS.VIEW_SCHOOLPROGRAM,

  // STEM-A-GIRL
  "/admin/stem-a-girl/courses": PERMISSIONS.VIEW_COURSE,
  "/admin/stem-a-girl/schools": PERMISSIONS.VIEW_SCHOOL,
  "/admin/stem-a-girl/activities": PERMISSIONS.VIEW_ACTIVITY,
  "/admin/stem-a-girl/events": PERMISSIONS.VIEW_EVENT
};

/**
 * Returns the permission required to access a given pathname.
 * First checks exact match, then falls back to parent routes.
 * Example: /admin/users/123 → /admin/users
 */
export function getRequiredPermission(pathname: string): string | null {
  // Remove trailing slash if present
  const normalized = pathname.replace(/\/$/, "");
  if (routePermissions[normalized]) return routePermissions[normalized];

  // Try parent routes (e.g., /admin/users/123 -> /admin/users)
  const parts = normalized.split("/");
  for (let i = parts.length; i > 2; i--) {
    const candidate = parts.slice(0, i).join("/");
    if (routePermissions[candidate]) return routePermissions[candidate];
  }
  return null;
}
