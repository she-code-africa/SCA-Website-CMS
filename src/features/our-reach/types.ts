// src/features/our-reach/types.ts
export type Reach = {
  _id: string;
  name: string;
  value: number;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type ReachFilters = {
  search?: string;
  sortBy?: "" | "createdAt" | "updatedAt" | "name" | "value";
};

export type ReachUpsertInput = {
  name: string;
  value: number;
  description: string;
};
