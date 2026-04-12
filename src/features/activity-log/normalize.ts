// // src/features/activity-log/normalize.ts
// import type { AuditLogEntry, AuditLogPayload } from "./types";

// export function normalizeActivityLogPayload(payload: unknown): {
//   rows: AuditLogEntry[];
//   totalPages: number;
//   currentPage: number;
//   totalAvailableLogs: number;
// } {
//   // If payload is an array, assume it's the data directly
//   if (Array.isArray(payload)) {
//     return {
//       rows: payload as AuditLogEntry[],
//       totalPages: 1,
//       currentPage: 1,
//       totalAvailableLogs: payload.length
//     };
//   }

//   // Otherwise treat as full payload object with pagination
//   const obj = payload as AuditLogPayload;
//   return {
//     rows: obj?.data ?? [],
//     totalPages: obj?.pagination?.totalPages ?? 1,
//     currentPage: obj?.pagination?.page ?? 1,
//     totalAvailableLogs: obj?.pagination?.total ?? 0
//   };
// }


// src/features/activity-log/normalize.ts
import type {
  AuditLogEntry,
  AuditLogPayload,
  RawAuditLogEntry,
} from "./types";

/**
 * "IDENTITY"            → { resourceType: "IDENTITY", resourceId: null }
 * "IDENTITY:abc123"     → { resourceType: "IDENTITY", resourceId: "abc123" }
 */
function parseAffectedResource(raw: string): {
  resourceType: string;
  resourceId: string | null;
} {
  const colonIndex = raw.indexOf(":");
  if (colonIndex === -1) {
    return { resourceType: raw, resourceId: null };
  }
  return {
    resourceType: raw.slice(0, colonIndex),
    resourceId: raw.slice(colonIndex + 1),
  };
}

function normalizeEntry(raw: RawAuditLogEntry): AuditLogEntry {
  const { resourceType, resourceId } = parseAffectedResource(
    raw.affectedResource ?? ""
  );
  return {
    id: raw._id,
    user: raw.user ?? null,
    action: raw.action,
    resourceType,
    resourceId,
    timestamp: raw.timestamp,
  };
}

export function normalizeActivityLogPayload(payload: unknown): {
  rows: AuditLogEntry[];
  totalPages: number;
  currentPage: number;
  totalAvailableLogs: number;
} {
  if (Array.isArray(payload)) {
    const rows = (payload as RawAuditLogEntry[]).map(normalizeEntry);
    return { rows, totalPages: 1, currentPage: 1, totalAvailableLogs: rows.length };
  }

  const obj = payload as AuditLogPayload;
  return {
    rows: (obj?.data ?? []).map(normalizeEntry),
    totalPages: obj?.pagination?.totalPages ?? 1,
    currentPage: obj?.pagination?.page ?? 1,
    totalAvailableLogs: obj?.pagination?.total ?? 0,
  };
}