// src/features/events/api.ts

import { api } from "@/lib/api/client";
import type { Event, EventUpsertInput } from "@/features/events/types";

export type { Event, EventUpsertInput };

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
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

export async function addEvent(input: {
  title: string;
  description: string;
  link: string;
  eventDate: string;
  image?: string | null;
}) {
  return api.post(`/events`, input);
}

export async function editEvent(payload: {
  id: string;
  data: {
    title?: string;
    description?: string;
    link?: string;
    eventDate?: string;
    image?: string | null;
  };
}) {
  return api.put(`/events/${payload.id}`, payload.data);
}

export async function deleteEvent(id: string) {
  return api.delete(`/events/${id}`);
}

// Publish an event (draft → published)
export async function publishEvent(id: string) {
  return api.patch(`/events/${id}/publish`);
}

// Archive an event (published → archived)
export async function archiveEvent(id: string) {
  return api.patch(`/events/${id}/archive`);
}
