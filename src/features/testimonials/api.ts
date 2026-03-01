// src/features/testimonials/api.ts
import { api } from "@/lib/api/client";
import type {
  Testimonial,
  TestimonialState,
  TestimonialUpsertInput
} from "@/features/testimonials/types";

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
   TESTIMONIALS
============================ */

export async function getTestimonials(): Promise<Testimonial[]> {
  const res: ApiListResponse<Testimonial> = await api.get(`/testimonials`);
  return normalizeList<Testimonial>(res);
}

export async function getTestimonial(id: string): Promise<Testimonial> {
  return api.get(`/testimonials/${id}`);
}

export async function addTestimonial(input: TestimonialUpsertInput) {
  const payload = {
    name: input.name,
    role: input.role,
    testimonial: input.testimonial
  };

  // If image handling is needed, convert to FormData
  // For now, sending as JSON based on old code
  return api.post(`/testimonials`, payload);
}

export async function editTestimonial(payload: {
  id: string;
  data: Partial<TestimonialUpsertInput>;
}) {
  return api.put(`/testimonials/${payload.id}`, payload.data);
}

export async function publishTestimonial(id: string) {
  return api.post(`/testimonials/change-state/${id}`, { state: "published" });
}

export async function archiveTestimonial(id: string) {
  return api.post(`/testimonials/change-state/${id}`, { state: "draft" });
}

export async function deleteTestimonial(id: string) {
  return api.delete(`/testimonials/${id}`);
}
