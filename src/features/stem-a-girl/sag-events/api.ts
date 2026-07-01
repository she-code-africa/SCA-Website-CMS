// src/features/sag-events/api.ts
import { api } from "@/lib/api/client";
import { sagUrl } from "@/lib/api/sag";
import type {
  SagActivity,
  SagEvent,
  SagEventsFilters,
  SagEventUpsertInput
} from "./types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

function buildQuery(filters: SagEventsFilters) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.state) params.set("state", filters.state);
  if (filters.activity) params.set("activity", filters.activity);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getSagEvents(
  filters: SagEventsFilters = {}
): Promise<SagEvent[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<SagEvent> = await api.get(sagUrl(`/event${qs}`));
  return normalizeList<SagEvent>(res);
}

export async function getSagEvent(id: string): Promise<SagEvent> {
  return api.get(sagUrl(`/event/${id}`));
}

export async function createSagEvent(input: SagEventUpsertInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("description", input.description);
  fd.append("activity", input.activity);
  fd.append("link", input.link);
  fd.append("eventDate", input.eventDate); // string (ISO recommended)
  fd.append("state", input.state ?? "draft");
  if (input.image) fd.append("image", input.image);

  return api.post(sagUrl(`/event`), fd);
}

export async function editSagEvent(payload: {
  id: string;
  data: Partial<SagEventUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.activity !== undefined) fd.append("activity", d.activity);
  if (d.link !== undefined) fd.append("link", d.link);
  if (d.eventDate !== undefined) fd.append("eventDate", d.eventDate);
  if (d.state !== undefined) fd.append("state", d.state);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(sagUrl(`/event/${payload.id}`), fd);
}

export async function deleteSagEvent(id: string) {
  return api.delete(sagUrl(`/event/${id}`));
}

export async function getSagActivities(): Promise<SagActivity[]> {
  const res: ApiListResponse<SagActivity> = await api.get(sagUrl(`/activity`));
  return normalizeList<SagActivity>(res);
}
