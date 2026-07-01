import { api } from "@/lib/api/client";
import type {
  Media,
  MediaFilters,
  MediaUpsertInput
} from "@/features/media/types";

/* ============================
    Helpers
============================ */

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];

  const r = res as any;

  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];

  return [];
}

function buildQuery(filters: MediaFilters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.type) params.set("type", filters.type);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ============================
    MEDIA
============================ */

export async function getAllMedia(
  filters: MediaFilters = {}
): Promise<Media[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<Media> = await api.get(`/media${qs}`);
  return normalizeList<Media>(res);
}

export async function getMedia(id: string): Promise<Media> {
  return api.get(`/media/${id}`);
}

export async function createMedia(input: MediaUpsertInput) {
  const fd = new FormData();

  fd.append("title", input.title);
  fd.append("description", input.description);
  fd.append("type", input.type);
  fd.append("author", input.author);
  fd.append("tag", input.tag);
  fd.append("link", input.link);

  if (input.dateCreated) {
    const formattedDate = new Date(input.dateCreated)
      .toISOString()
      .split("T")[0];
    fd.append("dateCreated", formattedDate);
  }

  if (input.coverImage) {
    fd.append("coverImage", input.coverImage);
  }

  if (input.images) {
    input.images.forEach((img) => {
      if (img instanceof File) {
        fd.append("images", img);
      }
    });
  }

  return api.post(`/media`, fd);
}

export async function editMedia(payload: {
  id: string;
  data: Partial<MediaUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.type !== undefined) fd.append("type", d.type);
  if (d.author !== undefined) fd.append("author", d.author);
  if (d.tag !== undefined) fd.append("tag", d.tag);
  if (d.link !== undefined) fd.append("link", d.link);

  if (d.dateCreated !== undefined) {
    const formattedDate = new Date(d.dateCreated).toISOString().split("T")[0];
    fd.append("dateCreated", formattedDate);
  }

  if (d.coverImage !== undefined && d.coverImage instanceof File) {
    fd.append("coverImage", d.coverImage);
  }

  if (d.images !== undefined) {
    d.images.forEach((img) => {
      fd.append("images", img);
    });
  }

  return api.put(`/media/${payload.id}`, fd);
}

export async function deleteMedia(id: string) {
  return api.delete(`/media/${id}`);
}
