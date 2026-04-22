// src/features/partners/types.ts

export type Partner = {
  _id: string;
  name: string;
  image?: string | null;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerFilters = {
  search?: string;
  featured?: "" | "true" | "false";
  sortBy?: "" | "createdAt" | "updatedAt" | "name";
};

export type PartnerUpsertInput = {
  name: string;
  featured: boolean;
  image?: string | null; // base64 string, not File
};
