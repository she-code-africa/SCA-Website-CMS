// src/features/activity-log/utils.ts
import { FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import type { ActivityLogRow } from "@/features/activity-log/types";

export const globalFilterFn: FilterFn<ActivityLogRow> = (
  row,
  _columnId,
  filterValue
) => {
  const q = String(filterValue ?? "")
    .toLowerCase()
    .trim();
  if (!q) return true;

  const u = row.original.user;

  const haystack = [
    u?.firstName,
    u?.lastName,
    u?.role,
    row.original.action,
    row.original.page
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
};

export function toCSV(rows: ActivityLogRow[]) {
  const headers = [
    "User",
    "Role",
    "Action",
    "Page",
    "Old",
    "New",
    "Created",
    "Updated"
  ];

  const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const body = rows.map((r) => {
    const user = `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.trim();
    const role = r.user?.role
      ? r.user.role.charAt(0).toUpperCase() + r.user.role.slice(1)
      : "";
    const action = r.action
      ? r.action.charAt(0).toUpperCase() + r.action.slice(1)
      : "";

    return [
      escape(user),
      escape(role),
      escape(action),
      escape(r.page ?? ""),
      escape(r.oldDoc?.name ?? "N/A"),
      escape(r.newDoc?.name ?? ""),
      escape(r.createdAt ? format(new Date(r.createdAt), "dd MMM, yyyy") : ""),
      escape(r.updatedAt ? format(new Date(r.updatedAt), "dd MMM, yyyy") : "")
    ].join(",");
  });

  return [headers.join(","), ...body].join("\n");
}

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

export function colClass(id: string) {
  // Tablet (md) shows compact columns, desktop (lg+) shows all
  switch (id) {
    case "oldDoc":
    case "newDoc":
    case "updatedAt":
      return "hidden lg:table-cell";
    default:
      return "";
  }
}