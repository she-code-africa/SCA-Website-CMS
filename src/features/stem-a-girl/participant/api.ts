// src/features/stem-a-girl/participants/api.ts
//
// MOCK API using dummy data. When the backend is ready, keep the same
// function name and return type, replace the body with a real call
// (same style as ../courses/api.ts), and delete ../shared/dummy-learners.ts.

import type { Participant } from "./types";
import { dummyLearners } from "../shared/dummy-learners";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getParticipants(): Promise<Participant[]> {
  await delay();
  return dummyLearners.map((p) => ({ ...p }));
}
