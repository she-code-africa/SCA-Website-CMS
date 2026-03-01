// src/features/chapters/types.ts

export type ChapterCategory = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ChapterState = "draft" | "published" | "archived";

export type Chapter = {
  _id: string;
  name: string;
  city: string;
  country: string;
  link?: string;
  description?: string;
  image?: string | null;
  leader?: string;
  state?: ChapterState;

  // Category can be populated or just ID
  category?: ChapterCategory | string;

  // Social media links
  socialMediaLinks?: Record<string, string>;

  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type ChapterEventState = "draft" | "published" | "archived";

export type ChapterEvent = {
  _id: string;
  title: string;
  description: string;
  link: string;
  eventDate: string; // ISO string
  images?: string[];
  eventState?: ChapterEventState;

  chapterId?: string;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type ChapterLead = {
  _id: string;
  name: string;
  role: string;
  image?: string | null;

  // Social media links
  socialMediaLinks?: Record<string, string>;

  chapterId?: string;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type ChapterFilters = {
  search?: string;
  state?: "" | ChapterState;
  category?: "" | string;
  sortBy?: "" | "createdAt" | "updatedAt" | "name";
};

export type ChapterEventFilters = {
  search?: string;
  eventState?: "" | ChapterEventState;
  sortBy?: "" | "createdAt" | "eventDate" | "title";
};

export type ChapterLeadFilters = {
  search?: string;
  sortBy?: "" | "name" | "role";
};

export type ChapterUpsertInput = {
  name: string;
  city: string;
  country: string;
  category: string;
  link: string;
  description: string;
  image?: File | string;
  socialMediaLinks?: Record<string, string>;
};

export type ChapterEventUpsertInput = {
  title: string;
  description: string;
  link: string;
  eventDate: string; // YYYY-MM-DD
  images?: File | string;
  chapterId: string;
};

export type ChapterLeadUpsertInput = {
  name: string;
  role: string;
  image?: File | string;
  chapterId: string;
  socialMediaLinks?: Record<string, string>;
};
