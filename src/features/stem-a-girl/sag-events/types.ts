// src/features/sag-events/types.ts

export type SagState = "draft" | "published" | "archived";

export type SagActivity = {
  _id: string;
  title: string;
  description?: string;
  image?: string | null;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type SagEvent = {
  _id: string;
  title: string;
  description: string;
  image?: string | null;

  link?: string;

  // backend sometimes returns populated object, sometimes id
  activity: SagActivity | string;

  state?: SagState;

  eventDate?: string; // ISO string

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type SagEventsFilters = {
  search?: string;
  state?: "" | SagState;
  activity?: "" | string;
};

export type SagEventUpsertInput = {
  title: string;
  description: string;
  activity: string; // activity id
  link: string;
  eventDate: string; // ISO string
  image?: File | null;
  state?: SagState;
};
