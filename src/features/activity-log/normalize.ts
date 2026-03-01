import type { ActivityLogPayload } from "./types";

export function normalizeActivityLogPayload(payload: ActivityLogPayload) {
  return {
    rows: payload?.data ?? [],
    totalPages: payload?.totalPages ?? 1,
    currentPage: payload?.currentPage ?? 1,
    totalAvailableLogs: payload?.totalAvailableLogs ?? 0
  };
}
