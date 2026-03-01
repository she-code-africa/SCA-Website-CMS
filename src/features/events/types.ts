// src/features/events/types.ts
export type EventState = "draft" | "published" | "archived";

export type Event = {
  _id: string;
  title: string;
  description: string;
  link: string;
  eventDate: string; // ISO string
  image?: string | null;
  state?: EventState;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type EventFilters = {
  search?: string;
  state?: "" | EventState;
  sortBy?: "" | "createdAt" | "updatedAt" | "eventDate" | "title";
};

export type EventUpsertInput = {
  title: string;
  description: string;
  link: string;
  eventDate: string; // ISO format YYYY-MM-DD
  image?: File | null;
};
