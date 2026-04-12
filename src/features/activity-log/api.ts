// src/features/activity-log/api.ts
import { api } from "@/lib/api/client";

export type ActivityLogQuery = {
  page: number;
  limit: number;
  startDate?: Date | null;
  endDate?: Date | null;
};

// GET /audit-logs
export async function getActivityLog(
  params: ActivityLogQuery
): Promise<unknown> {
  const { page, limit, startDate, endDate } = params;
  let url = `/audit-logs?page=${page}&limit=${limit}`;
  if (startDate) url += `&startDate=${startDate.toISOString()}`;
  if (endDate) url += `&endDate=${endDate.toISOString()}`;
  return api.get(url);
}

// GET /audit-logs/export – returns a Blob
export async function exportActivityLogs(params: {
  startDate?: Date | null;
  endDate?: Date | null;
}): Promise<Blob> {
  const { startDate, endDate } = params;
  let url = `/audit-logs/export`;
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("startDate", startDate.toISOString());
  if (endDate) queryParams.append("endDate", endDate.toISOString());
  if (queryParams.toString()) url += `?${queryParams.toString()}`;

  // The interceptor might return the blob directly or the response object.
  // We'll assume the interceptor returns the blob (response.data).
  const blob = await api.get(url, { responseType: "blob" });
  return blob as Blob;
}
