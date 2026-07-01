// src/features/stem-a-girl/activities/types.ts

export type SAGActivity = {
  _id: string;
  title: string;
  description: string;
  image?: string | null;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type SAGActivitiesFilters = {
  search?: string;
};

export type SAGActivityUpsertInput = {
  title: string;
  description: string;
  image?: File | null;
};
