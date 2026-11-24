// src/features/stem-a-girl/consent/api.ts
//
// MOCK API using dummy data. When the backend is ready, keep the same
// function names and signatures, replace the bodies with real calls
// (same style as ../courses/api.ts), and delete ../shared/dummy-learners.ts.

import type { ConsentRecord, ConsentUpdateInput } from "./types";
import { dummyConsentRecords } from "../shared/dummy-learners";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory copy, so edits show up while you click around (resets on refresh)
const store: ConsentRecord[] = dummyConsentRecords.map((r) => ({ ...r }));

export async function getConsentRecords(): Promise<ConsentRecord[]> {
  await delay();
  return store.map((r) => ({ ...r }));
}

export async function updateConsentRecord(
  id: string,
  data: ConsentUpdateInput,
): Promise<ConsentRecord> {
  await delay(250);
  const index = store.findIndex((r) => r._id === id);
  if (index === -1) throw new Error("Consent record not found");
  store[index] = { ...store[index], ...data };
  return { ...store[index] };
}

export async function deactivateConsentAccount(
  id: string,
): Promise<ConsentRecord> {
  return updateConsentRecord(id, {
    consentStatus: "Deactivated",
    accountStatus: "Inactive",
  });
}
