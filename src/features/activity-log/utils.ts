// src/features/activity-log/utils.ts

import { FilterFn } from "@tanstack/react-table";
import { subDays, startOfDay, endOfDay } from "date-fns";
import type {
  AuditLogEntry,
  DateRangePreset
} from "@/features/activity-log/types";

// ─── Labels for user-friendly display ─────────────────────────────────────
const ACTION_LABELS: Record<string, string> = {
  CREATE: "Created",
  UPDATE: "Updated",
  DELETE: "Deleted",
  LOGIN: "Logged in",
  LOGOUT: "Logged out"
};

const RESOURCE_LABELS: Record<string, string> = {
  IDENTITY: "Identity",
  USER: "User",
  ROLE: "Role",
  SESSION: "Session"
};

// ─── TanStack global filter ───────────────────────────────────────────────
export const globalFilterFn: FilterFn<AuditLogEntry> = (row, _colId, value) => {
  const search = String(value).toLowerCase();
  const { user, action, resourceType } = row.original;
  return (
    (user?.email ?? "system").toLowerCase().includes(search) ||
    action.toLowerCase().includes(search) ||
    resourceType.toLowerCase().includes(search)
  );
};

// ─── Date range resolver ──────────────────────────────────────────────────
export function resolveDatePreset(preset: DateRangePreset): {
  startDate: Date | null;
  endDate: Date | null;
} {
  const now = new Date();
  switch (preset) {
    case "today":
      return { startDate: startOfDay(now), endDate: endOfDay(now) };
    case "last7":
      return { startDate: startOfDay(subDays(now, 6)), endDate: endOfDay(now) };
    case "last30":
      return {
        startDate: startOfDay(subDays(now, 29)),
        endDate: endOfDay(now)
      };
    default:
      return { startDate: null, endDate: null };
  }
}

// ─── User‑friendly descriptions ───────────────────────────────────────────
export function getFriendlyAction(entry: AuditLogEntry): string {
  return (
    ACTION_LABELS[entry.action?.toUpperCase()] ?? entry.action ?? "Unknown"
  );
}

export function getFriendlyResource(entry: AuditLogEntry): string {
  const label =
    RESOURCE_LABELS[entry.resourceType] ?? entry.resourceType ?? "Resource";
  const actionVerb = getFriendlyAction(entry);
  return `${label} ${actionVerb}`;
}

export function getActivityDescription(entry: AuditLogEntry): string {
  const actor = entry.user?.email ?? "System";
  const resource =
    RESOURCE_LABELS[entry.resourceType] ?? entry.resourceType ?? "record";
  const verb = getFriendlyAction(entry).toLowerCase();
  return `${actor} ${verb} ${resource.toLowerCase()}`;
}
