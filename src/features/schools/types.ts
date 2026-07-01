// src/features/schools/types.ts

export type School = {
  _id: string;
  name: string;
  description: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type SchoolsFilters = {
  search?: string;
};

export type SchoolUpsertInput = {
  name: string;
  description: string;
};
