// src/features/stem-a-girl/outreach/types.ts

export type OutreachState = string; // e.g. "Lagos", "Abuja" – free text or predefined?

export interface Outreach {
  _id: string;
  state: OutreachState;
  description: string;
  outreachDate: string; // ISO string
  galleryLink?: string;
  coverImage?: string;
  previewImages?: string[]; // array of image URLs
  totalImages?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type OutreachUpsertInput = {
  state: string;
  description: string;
  outreachDate: string; // YYYY-MM-DD or ISO
  galleryLink?: string;
  coverImage?: string | null; // base64 string
  previewImages?: string[]; // array of image URLs (for update we may send full list)
};

export interface OutreachFilters {
  search?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}
