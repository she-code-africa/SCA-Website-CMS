// src/features/jobs/api.ts
import { api } from "@/lib/api/client";
import type {
  Job,
  JobCategory,
  JobType,
  JobUpsertInput
} from "@/features/jobs/types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

/* ============================
   JOBS
============================ */

export async function getJobs(): Promise<Job[]> {
  const res: ApiListResponse<Job> = await api.get(`/job/postings`);
  return normalizeList<Job>(res);
}

export async function getJob(id: string): Promise<Job> {
  return api.get(`/job/postings/${id}`);
}

export async function addJob(input: JobUpsertInput) {
  return api.post(`/job/postings`, input);
}

export async function editJob(payload: {
  id: string;
  data: Partial<JobUpsertInput>;
}) {
  return api.put(`/job/postings/${payload.id}`, payload.data);
}

export async function publishJob(id: string) {
  return api.patch(`/job/postings/${id}/publish`);
}

export async function archiveJob(id: string) {
  return api.patch(`/job/postings/${id}/archive`);
}

export async function deleteJob(id: string) {
  return api.delete(`/job/postings/${id}`);
}

/* ============================
   JOB CATEGORIES
============================ */

export async function getJobCategories(): Promise<JobCategory[]> {
  const res: ApiListResponse<JobCategory> = await api.get(`/job/category`);
  return normalizeList<JobCategory>(res);
}

export async function addJobCategory(payload: { name: string }) {
  return api.post(`/job/category`, payload);
}

export async function editJobCategory(payload: {
  catId: string;
  name: string | { name: string };
}) {
  return api.put(`/job/category/${payload.catId}`, payload.name);
}

export async function deleteJobCategory(id: string) {
  return api.delete(`/job/category/${id}`);
}

/* ============================
  JOB TYPES
============================ */

export async function getJobTypes(): Promise<JobType[]> {
  const res: ApiListResponse<JobType> = await api.get(`/job/types`);
  return normalizeList<JobType>(res);
}

export async function addJobType(payload: { name: string }) {
  return api.post(`/job/types`, payload);
}

export async function editJobType(payload: {
  id: string;
  data: { name: string };
}) {
  return api.put(`/job/types/${payload.id}`, payload.data);
}

export async function deleteJobType(id: string) {
  return api.delete(`/job/types/${id}`);
}
