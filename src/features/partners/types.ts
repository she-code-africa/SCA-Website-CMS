// src/features/partners/types.ts
export type Partner = {
  _id: string;
  name: string;
  image?: string | null;
  featured?: boolean;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type PartnerFilters = {
  search?: string;
  featured?: "" | "true" | "false";
  sortBy?: "" | "createdAt" | "updatedAt" | "name";
};

export type PartnerUpsertInput = {
  name: string;
  featured: boolean;
  image?: File | null;
};
