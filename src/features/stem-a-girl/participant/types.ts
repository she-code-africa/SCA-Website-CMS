// src/features/stem-a-girl/participants/types.ts

import type { Learner } from "@/features/stem-a-girl/shared/types";

export type Participant = Learner;

export type EnrolledPreset =
  | "any"
  | "today"
  | "7d"
  | "30d"
  | "quarter"
  | "custom";

// "all" means "no filter" for the dropdowns
export type ParticipantFilters = {
  search: string;
  course: string;
  age: string;
  country: string;
  status: string;
  enrolled: EnrolledPreset;
  dateFrom: string; // only used when enrolled === "custom"
  dateTo: string; // only used when enrolled === "custom"
};

export const DEFAULT_PARTICIPANT_FILTERS: ParticipantFilters = {
  search: "",
  course: "all",
  age: "all",
  country: "all",
  status: "all",
  enrolled: "any",
  dateFrom: "",
  dateTo: "",
};
