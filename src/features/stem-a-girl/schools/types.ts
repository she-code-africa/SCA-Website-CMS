// src/features/stem-a-girl/schools/types.ts

export type SAGSchool = {
  _id: string;
  name: string;
  description: string;
  image?: string | null;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type SAGSchoolsFilters = {
  search?: string;
};

export type SAGSchoolUpsertInput = {
  name: string;
  description: string;
  image?: File | null;
};
