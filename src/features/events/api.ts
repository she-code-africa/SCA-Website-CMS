// src/features/events/api.ts
import { api } from "@/lib/api/client";
import type { Event, EventUpsertInput } from "@/features/events/types";

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
   EVENTS
============================ */

export async function getEvents(): Promise<Event[]> {
  const res: ApiListResponse<Event> = await api.get(`/events`);
  return normalizeList<Event>(res);
}

export async function getEvent(id: string): Promise<Event> {
  return api.get(`/events/${id}`);
}

export async function addEvent(input: EventUpsertInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("description", input.description);
  fd.append("link", input.link);
  fd.append("eventDate", input.eventDate);
  if (input.image) fd.append("image", input.image);

  return api.post(`/events`, fd);
}

export async function editEvent(payload: {
  id: string;
  data: Partial<EventUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.link !== undefined) fd.append("link", d.link);
  if (d.eventDate !== undefined) fd.append("eventDate", d.eventDate);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(`/events/${payload.id}`, fd);
}

export async function publishEvent(id: string) {
  return api.patch(`/events/${id}/publish`);
}

export async function archiveEvent(id: string) {
  return api.patch(`/events/${id}/archive`);
}

export async function deleteEvent(id: string) {
  return api.delete(`/events/${id}`);
}
