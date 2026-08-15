// src/features/chapters/api.ts
import { api } from "@/lib/api/client";
import type {
  Chapter,
  ChapterCategory,
  ChapterEvent,
  ChapterLead,
} from "./types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

type ChapterPagedResponse = {
  data: Chapter[];
  totalPages: number;
  currentPage: number;
};

function findFirstArray(v: any, depth = 0): any[] | null {
  if (depth > 5) return null;
  if (Array.isArray(v)) return v;

  if (v && typeof v === "object") {
    for (const key of Object.keys(v)) {
      const found = findFirstArray(v[key], depth + 1);
      if (found) return found;
    }
  }

  return null;
}

function toNum(v: any, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function normalizePagedChapters(res: unknown): ChapterPagedResponse {
  const r = res as any;

  // Some api clients return axios response, some return already-unwrapped payload
  const payload = r?.data ?? r;

  // Find array anywhere within payload up to a depth
  const data = (findFirstArray(payload) ?? []) as Chapter[];

  // Try common pagination keys anywhere reasonable
  const totalPages =
    toNum(payload?.totalPages, 0) ||
    toNum(payload?.data?.totalPages, 0) ||
    toNum(payload?.pagination?.totalPages, 0) ||
    toNum(payload?.meta?.totalPages, 0) ||
    1;

  const currentPage =
    toNum(payload?.currentPage, 0) ||
    toNum(payload?.data?.currentPage, 0) ||
    toNum(payload?.pagination?.currentPage, 0) ||
    toNum(payload?.meta?.currentPage, 0) ||
    1;

  return { data, totalPages, currentPage };
}

/* ============================
   CHAPTER CATEGORIES
============================ */

export async function getChapterCategories(): Promise<ChapterCategory[]> {
  const res: ApiListResponse<ChapterCategory> =
    await api.get(`/chapters/categories`);
  return normalizeList<ChapterCategory>(res);
}

export async function addChapterCategory(payload: { name: string }) {
  return api.post(`/chapters/categories`, payload);
}

export async function editChapterCategory(payload: {
  id: string;
  data: { name: string };
}) {
  return api.put(`/chapters/categories/${payload.id}`, payload.data);
}

export async function deleteChapterCategory(id: string) {
  return api.delete(`/chapters/categories/${id}`);
}

/* ============================
  CHAPTERS 
============================ */

export async function getChapters(
  page: number = 1,
  limit: number = 10,
): Promise<ChapterPagedResponse> {
  const res = await api.get(
    `/chapters/member-chapters?page=${page}&limit=${limit}`,
  );
  return normalizePagedChapters(res);
}

export async function getChapter(id: string): Promise<Chapter> {
  return api.get(`/chapters/member-chapters/${id}`);
}

export async function addChapter(input: FormData) {
  return api.post(`/chapters/member-chapters`, input);
}

export async function editChapter(payload: {
  id: string;
  categoryId?: string;
  data: FormData;
}) {
  return api.put(`/chapters/member-chapters/${payload.id}`, payload.data);
}

export async function deleteChapter(payload: {
  id: string;
  categoryId?: string;
}) {
  return api.delete(`/chapters/member-chapters/${payload.id}`);
}

// Publish a chapter (draft → published)
export async function publishChapter(payload: {
  id: string;
  categoryId?: string;
}) {
  return api.put(
    `/chapters/categories/${payload.categoryId}/member-chapters/${payload.id}/publish`,
  );
}

// Archive a chapter (published → archived)
export async function archiveChapter(payload: {
  id: string;
  categoryId?: string;
}) {
  return api.put(
    `/chapters/categories/${payload.categoryId}/member-chapters/${payload.id}/archive`,
  );
}

/* ============================
  CHAPTER EVENTS
============================ */

export async function getChapterEvents(
  chapterId: string,
): Promise<ChapterEvent[]> {
  const res: ApiListResponse<ChapterEvent> = await api.get(
    `/chapters/events/${chapterId}`,
  );
  return normalizeList<ChapterEvent>(res);
}

export async function getChapterEvent(id: string): Promise<ChapterEvent> {
  return api.get(`/chapters/event/${id}`);
}

export async function addChapterEvent(input: FormData) {
  return api.post(`/chapters/events`, input, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function editChapterEvent(payload: {
  id: string;
  data: FormData;
}) {
  return api.put(`/chapters/event/${payload.id}`, payload.data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function publishChapterEvent(id: string) {
  return api.patch(`/chapters/event/${id}/publish`);
}

export async function archiveChapterEvent(id: string) {
  return api.patch(`/chapters/event/${id}/archive`);
}

export async function deleteChapterEvent(id: string) {
  return api.delete(`/chapters/event/${id}`);
}

/* ============================
  CHAPTER LEADS
============================ */

export async function getChapterLeads(
  chapterId: string,
): Promise<ChapterLead[]> {
  const res: ApiListResponse<ChapterLead> = await api.get(
    `/chapters/chapterLeads/${chapterId}`,
  );
  return normalizeList<ChapterLead>(res);
}

export async function getChapterLead(id: string): Promise<ChapterLead> {
  return api.get(`/chapters/lead/${id}`);
}

export async function addChapterLead(input: FormData) {
  return api.post(`/chapters/chapterLeads`, input);
}

export async function editChapterLead(payload: { id: string; data: FormData }) {
  return api.put(`/chapters/lead/${payload.id}`, payload.data);
}

export async function deleteChapterLead(id: string) {
  return api.delete(`/chapters/lead/${id}`);
}
