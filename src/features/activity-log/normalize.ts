// src/features/activity-log/normalize.ts

import type { AuditLogEntry, AuditLogPayload, RawAuditLogEntry } from "./types";

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
    resourceId: raw.slice(colonIndex + 1)
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
    timestamp: raw.timestamp
  };
}

export function normalizeActivityLogPayload(payload: unknown): {
  rows: AuditLogEntry[];
  totalPages: number;
  currentPage: number;
  totalAvailableLogs: number;
} {
  // Case 1: payload is the new wrapped object from the interceptor
  const isWrappedPaginated =
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    "pagination" in payload;
  if (isWrappedPaginated) {
    const wrapped = payload as {
      data: RawAuditLogEntry[];
      pagination: { totalPages: number; page: number; total: number };
    };
    return {
      rows: wrapped.data.map(normalizeEntry),
      totalPages: wrapped.pagination.totalPages,
      currentPage: wrapped.pagination.page,
      totalAvailableLogs: wrapped.pagination.total
    };
  }

  // Case 2: payload is the original full response (AuditLogPayload)
  const isFullResponse =
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    "pagination" in payload;
  if (isFullResponse) {
    const obj = payload as AuditLogPayload;
    return {
      rows: (obj.data ?? []).map(normalizeEntry),
      totalPages: obj.pagination?.totalPages ?? 1,
      currentPage: obj.pagination?.page ?? 1,
      totalAvailableLogs: obj.pagination?.total ?? 0
    };
  }

  // Case 3: payload is already an array (legacy / direct array)
  if (Array.isArray(payload)) {
    const rows = (payload as RawAuditLogEntry[]).map(normalizeEntry);
    return {
      rows,
      totalPages: 1,
      currentPage: 1,
      totalAvailableLogs: rows.length
    };
  }

  // Case 4: fallback (empty)
  return { rows: [], totalPages: 1, currentPage: 1, totalAvailableLogs: 0 };
}
