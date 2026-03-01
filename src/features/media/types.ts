// src/features/media/types.ts

export type MediaType = "blog" | "video" | "image";

export type Media = {
  _id: string;
  title: string;
  description: string;
  type: MediaType;
  author: string;
  tag: string;
  link?: string;
  videoLink?: string;
  blogLink?: string;
  dateCreated?: string; // ISO string
  coverImage?: string | null;
  images?: string[]; // Array of image URLs
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type MediaFiltersType = {
  search?: string;
  type?: "" | MediaType;
};

export type MediaUpsertInput = {
  title: string;
  description: string;
  type: MediaType;
  author: string;
  tag: string;
  link: string;
  dateCreated: string;
  coverImage?: File | null;
  images?: (File | string)[]; // Mix of new Files and existing URLs
};