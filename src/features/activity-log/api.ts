// api.ts
import type { ActivityLogPayload } from "@/features/activity-log/types";
import { api } from "@/lib/api/client";

export type ActivityLogQuery = {
  page: number;
  limit: number;
  startDate?: Date | null;
  endDate?: Date | null;
};


export async function getActivityLog(params: ActivityLogQuery): Promise<ActivityLogPayload> {
  const { page, limit, startDate, endDate } = params;

  let url = `/logs?page=${page}&limit=${limit}`;
  if (startDate) url += `&startDate=${startDate.toISOString()}`;
  if (endDate) url += `&endDate=${endDate.toISOString()}`;

  // because interceptor returns response.data for /logs
  return api.get(url);
}

