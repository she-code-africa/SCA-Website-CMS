// src/features/stem-a-girl/impact-stories/types.ts

export type ImpactStoryState = "draft" | "published" | "archived";

export interface ImpactStory {
  _id: string;
  name: string;
  story: string;
  school?: string | { _id: string; name: string }; // ID or populated object
  image?: string;
  state?: ImpactStoryState;
  createdAt?: string;
  updatedAt?: string;
}

export type ImpactStoryUpsertInput = {
  name: string;
  story: string;
  school: string; // ID
  image?: string | null; // base64 string or null
  state?: ImpactStoryState;
};

export interface ImpactStoryFilters {
  search?: string;
  state?: string;
  school?: string;
  sortBy?: string;
}
