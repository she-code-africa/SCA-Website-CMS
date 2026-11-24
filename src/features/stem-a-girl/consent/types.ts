// src/features/stem-a-girl/consent/types.ts

import type { Learner } from "@/features/stem-a-girl/shared/types";

export type ConsentStatus = "Approved" | "Pending" | "Deactivated";
export type AccountStatus = "Active" | "Inactive";

// A learner under 18 plus their guardian consent details
export type ConsentRecord = Learner & {
  guardianEmail: string;
  consentStatus: ConsentStatus;
  accountStatus: AccountStatus;
  consentSubmittedAt: string; // YYYY-MM-DD
};

export type ConsentFilters = {
  search: string;
  state: ConsentStatus | "all";
};

export const DEFAULT_CONSENT_FILTERS: ConsentFilters = {
  search: "",
  state: "all",
};

export type ConsentUpdateInput = Partial<
  Pick<ConsentRecord, "consentStatus" | "accountStatus">
>;
