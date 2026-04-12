 // src/features/activity-log/utils.ts
import { FilterFn } from "@tanstack/react-table";
// import { format } from "date-fns";
import type { AuditLogEntry } from "@/features/activity-log/types";


// ─── Human-readable labels ────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Created",
  UPDATE: "Updated",
  DELETE: "Deleted",
  LOGIN:  "Logged in",
  LOGOUT: "Logged out",
};

const RESOURCE_LABELS: Record<string, string> = {
  IDENTITY: "Identity",
  USER:     "User",
  ROLE:     "Role",
  SESSION:  "Session",
  // extend as your API introduces new resource types
};
// ─── TanStack global filter ───────────────────────────────────────────────────

export const globalFilterFn: FilterFn<AuditLogEntry> = (row, _colId, value) => {
  const search = String(value).toLowerCase();
  const { user, action, resourceType } = row.original;
  return (
    (user?.email ?? "system").toLowerCase().includes(search) ||
    action.toLowerCase().includes(search) ||
    resourceType.toLowerCase().includes(search)
  );
};

// export function toCSV(rows: AuditLogEntry[]): string {
//   const headers = [
//     "User Email",
//     "Module",
//     "Action",
//     "Affected Resource",
//     "Method",
//     "Path",
//     "Timestamp",
//   ];

//   const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

//   // const body = rows.map((r) => {
//   //   return [
//   //     escape(r.user?.email ?? ""),
//   //     escape(r.module ?? ""),
//   //     escape(r.action ?? ""),
//   //     escape(r.affectedResource ?? ""),
//   //     escape(r.method ?? ""),
//   //     escape(r.path ?? ""),
//   //     escape(
//   //       r.timestamp ? format(new Date(r.timestamp), "dd MMM, yyyy HH:mm:ss") : ""
//   //     ),
//   //   ].join(",");
//   // });

//   // return [headers.join(","), ...body].join("\n");
// }

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// export function colClass(id: string) {
//   return "";
// }

// Helper to get user‑friendly action text
export function getFriendlyAction(entry: AuditLogEntry): string {
  return (
    ACTION_LABELS[entry.action?.toUpperCase()] ?? entry.action ?? "Unknown"
  );
}

// Convert raw module/affectedResource to a friendly name
export function getFriendlyResource(entry: AuditLogEntry): string {
  const label =
    RESOURCE_LABELS[entry.resourceType] ?? entry.resourceType ?? "Resource";
  const actionVerb = getFriendlyAction(entry);

  // e.g. "Identity Created", "Identity Deleted"
  return `${label} ${actionVerb}`;
}

/** Returns a short description shown in the table "Description" column */
export function getActivityDescription(entry: AuditLogEntry): string {
  const actor = entry.user?.email ?? "System";
  const resource = RESOURCE_LABELS[entry.resourceType] ?? entry.resourceType ?? "record";
  const verb = getFriendlyAction(entry).toLowerCase();

  if (entry.resourceId) {
    return `${actor} ${verb} a ${resource.toLowerCase()}`;
  }
  return `${actor} ${verb} ${resource.toLowerCase()}`;
}


// // Helper to capitalise a string
// function capitalise(str: string): string {
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// }

// // Extract a readable resource name from an API path
// function extractResourceFromPath(path: string): string {
//   if (!path) return "Unknown";
//   const cleanPath = path.split("?")[0].replace(/\/$/, "");
//   const parts = cleanPath.split("/").filter(Boolean);
//   const resourcePart = parts[1] || parts[0] || "";
//   let resource = resourcePart.replace(/[-_]/g, " ");
//   if (resource.endsWith("ies")) resource = resource.slice(0, -3) + "y";
//   else if (resource.endsWith("s") && !resource.endsWith("ss"))
//     resource = resource.slice(0, -1);
//   return capitalise(resource);
// }

// Special‑case overrides for when path‑based extraction needs a custom description
// const specialResourceMappings: {
//   pattern: RegExp;
//   getDescription: (log: AuditLogEntry) => string;
// }[] = [
//   {
//     pattern: /\/users\/[^/]+\/activate/,
//     getDescription: () => "User account activation",
//   },
//   {
//     pattern: /\/users\/[^/]+\/deactivate/,
//     getDescription: () => "User account deactivation",
//   },
//   {
//     pattern: /\/users\/[^/]+\/role/,
//     getDescription: () => "User role change",
//   },
//   {
//     pattern: /\/users\/invite/,
//     getDescription: () => "User invitation sent",
//   },
//   {
//     pattern: /\/auth\/login/,
//     getDescription: () => "User login",
//   },
// ];


// export function getResourceDescription(log: AuditLogEntry): string {
//   // Prefer path if it exists (most accurate)
//   if (log.path) {
//     for (const mapping of specialResourceMappings) {
//       if (mapping.pattern.test(log.path)) {
//         return mapping.getDescription(log);
//       }
//     }
//     const resource = extractResourceFromPath(log.path);
//     const action = getFriendlyAction(log).toLowerCase();
//     return `${resource} ${action}`;
//   }

//   // No path – use affectedResource or module
//   const identifier = log.affectedResource || log.module;
//   if (identifier) {
//     const friendlyName = getFriendlyResourceName(identifier);
//     const action = getFriendlyAction(log).toLowerCase();
//     return `${friendlyName} ${action}`;
//   }

//   // Ultimate fallback
//   return "System event";
// }