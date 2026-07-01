// src/features/testimonials/types.ts
export type TestimonialState = "draft" | "published" | "archived";

export type Testimonial = {
  _id: string;
  name: string;
  role: string;
  testimonial: string;
  image?: string | null;
  state?: TestimonialState;
  publishDate?: string;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type TestimonialFilters = {
  search?: string;
  state?: "" | TestimonialState;
  sortBy?: "" | "createdAt" | "updatedAt" | "publishDate" | "name";
};

export type TestimonialUpsertInput = {
  name: string;
  role: string;
  testimonial: string;
  image?: File | null;
};
