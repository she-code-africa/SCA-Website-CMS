// src/features/stem-a-girl/participants/utils.ts

import { isoDaysAgo } from "@/features/stem-a-girl/shared/format";
import type { Participant, ParticipantFilters } from "./types";

// Turns the "Enrolled" dropdown into a [from, to] date pair ("" = no limit)
export function getEnrolledRange(
  filters: ParticipantFilters,
): [string, string] {
  const today = isoDaysAgo(0);

  switch (filters.enrolled) {
    case "today":
      return [today, today];
    case "7d":
      return [isoDaysAgo(6), today];
    case "30d":
      return [isoDaysAgo(29), today];
    case "quarter": {
      const now = new Date();
      const firstMonth = Math.floor(now.getMonth() / 3) * 3 + 1;
      return [
        `${now.getFullYear()}-${String(firstMonth).padStart(2, "0")}-01`,
        today,
      ];
    }
    case "custom":
      return [filters.dateFrom, filters.dateTo];
    default:
      return ["", ""];
  }
}

export function applyParticipantFilters(
  rows: Participant[],
  filters: ParticipantFilters,
) {
  const search = filters.search.trim().toLowerCase();
  const [from, to] = getEnrolledRange(filters);

  return rows.filter((p) => {
    // A learner matches a course if they are on it OR have finished it
    if (
      filters.course !== "all" &&
      p.course !== filters.course &&
      p.completedCourse !== filters.course
    ) {
      return false;
    }
    if (filters.age !== "all" && p.ageRange !== filters.age) return false;
    if (filters.country !== "all" && p.country !== filters.country) {
      return false;
    }
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (from && p.enrolledDate < from) return false;
    if (to && p.enrolledDate > to) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search) &&
      !p.email.toLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });
}
