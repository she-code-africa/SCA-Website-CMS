// src/features/reports/api.ts
import { api } from "@/lib/api/client";
import type {
  Report,
  ReportDownloadUser,
  ReportUpsertInput
} from "@/features/reports/types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];

  const r = res as any;

  // { data: [...] }
  if (Array.isArray(r?.data)) return r.data as T[];

  // { data: { data: [...] } }
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];

  return [];
}

/* ============================
    REPORTS
============================ */

export async function getReports(): Promise<Report[]> {
  const res: ApiListResponse<Report> = await api.get(`/reports`);
  return normalizeList<Report>(res);
}

export async function getReport(id: string): Promise<Report> {
  return api.get(`/reports/${id}`);
}

export async function addReport(input: ReportUpsertInput) {
  return api.post(`/reports`, input);
}

export async function editReport(payload: {
  id: string;
  data: Partial<ReportUpsertInput>;
}) {
  return api.put(`/reports/${payload.id}`, payload.data);
}

export async function deleteReport(id: string) {
  return api.delete(`/reports/${id}`);
}

/* ============================
    ANNUAL REPORT DOWNLOAD LOG
============================ */

export async function getReportDownloads(): Promise<ReportDownloadUser[]> {
  const res: ApiListResponse<ReportDownloadUser> =
    await api.get(`/annual-report`);
  return normalizeList<ReportDownloadUser>(res);
}