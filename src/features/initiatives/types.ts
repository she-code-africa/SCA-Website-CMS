// src/features/initiatives/types.ts
export type Initiative = {
  _id: string;
  title: string;
  description: string; // HTML content from rich text editor
  initiative_url: string;
  donation_url?: string;
  image?: string | null;
  isAvailable?: boolean;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type InitiativeFilters = {
  search?: string;
  isAvailable?: "" | "true" | "false";
  sortBy?: "" | "createdAt" | "updatedAt" | "title";
};

export type InitiativeUpsertInput = {
  title: string;
  description: string; // HTML content
  initiative_url: string;
  donation_url: string;
  isAvailable: boolean;
  image?: File | null;
};
