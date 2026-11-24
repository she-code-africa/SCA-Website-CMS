// src/features/stem-a-girl/consent/utils.ts

import type { ConsentFilters, ConsentRecord } from "./types";

export function applyConsentFilters(
  rows: ConsentRecord[],
  filters: ConsentFilters,
) {
  const search = filters.search.trim().toLowerCase();

  return rows.filter((r) => {
    if (
      search &&
      !r.name.toLowerCase().includes(search) &&
      !r.username.includes(search) &&
      !r.guardianEmail.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (filters.state !== "all" && r.consentStatus !== filters.state) {
      return false;
    }
    return true;
  });
}
