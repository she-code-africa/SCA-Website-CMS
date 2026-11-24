// src/features/stem-a-girl/shared/dummy-learners.ts
//
// TEMPORARY dummy data, ported from the SAG admin prototype.
// Delete this file once the real API is ready (see the api.ts files).
//
// The data is "seeded", so it is the same on every page load
// (the prototype used Math.random, which changes on every refresh).

import type { AgeRange, Learner, LearnerStatus } from "./types";
import type { ConsentRecord } from "../consent/types";
import { isoDaysAgo } from "./format";

export const LEARNER_COURSES = [
  "Coding With Scratch",
  "Game Development",
  "Robotics",
] as const;

export const LEARNER_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "Uganda",
  "Rwanda",
] as const;

const FIRST_NAMES = [
  "Amara", "Zara", "Fatima", "Nkechi", "Chioma", "Aisha", "Imani",
  "Yewande", "Sade", "Kemi", "Bola", "Ngozi", "Ada", "Temi", "Funmi",
  "Ola", "Bisi", "Dayo", "Fola", "Tope",
];

const LAST_NAMES = [
  "Okonkwo", "Ahmed", "Mensah", "Kamau", "Wanjiku", "Ibrahim", "Owusu",
  "Adeyemi", "Bello", "Chukwu", "Maina", "Eze", "Osei", "Asante",
  "Diallo", "Kofi", "Nwosu", "Abubakar", "Okafor", "Dlamini",
];

// Small seeded random number generator (mulberry32)
function createRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(20261124);
const randInt = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const randDate = (daysBack: number) => isoDaysAgo(randInt(0, daysBack));

// ---------- 120 learners, ages 10 - 21 ----------
export const dummyLearners: Learner[] = Array.from({ length: 120 }, (_, i) => {
  // Every name pair is unique, so usernames never clash
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last =
    LAST_NAMES[
      (i * 7 + Math.floor(i / FIRST_NAMES.length) * 3) % LAST_NAMES.length
    ];

  // ~12% inactive, ~53% active, the rest completed (no drafts)
  const roll = rng();
  const status: LearnerStatus =
    roll < 0.12 ? "Inactive" : roll < 0.65 ? "Active" : "Completed";

  const age = randInt(10, 21);
  const ageRange: AgeRange = age <= 13 ? "10-13" : age <= 17 ? "14-17" : "18-21";

  const course = pick(LEARNER_COURSES);
  let completedCourse: string | null = null;
  let completedCourseDate: string | null = null;

  // Some learners already finished a different course before this one
  const chance = status === "Completed" ? 0.25 : 0.45;
  if (rng() < chance) {
    completedCourse = pick(LEARNER_COURSES.filter((c) => c !== course));
    completedCourseDate = randDate(status === "Completed" ? 240 : 150);
  }

  return {
    _id: `lrn_${String(i + 1).padStart(3, "0")}`,
    name: `${first} ${last}`,
    username: `${first}_${last}`.toLowerCase(),
    email: `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1, 99)}@email.com`,
    course,
    completedCourse,
    completedCourseDate,
    ageRange,
    age,
    country: pick(LEARNER_COUNTRIES),
    status,
    enrolledDate: randDate(120),
    completionDate: status === "Completed" ? randDate(45) : null,
    completion: status === "Completed" ? 100 : randInt(15, 95),
  };
});

// ---------- Consent records: learners under 18 only ----------
export const dummyConsentRecords: ConsentRecord[] = dummyLearners
  .filter((l) => l.age < 18)
  .map((l, idx) => {
    // The first 12 are always pending so the page has something to review
    const isPending = idx < 12 || rng() < 0.15;
    const lastName = l.name.split(" ")[1].toLowerCase();

    return {
      ...l,
      guardianEmail: `parent.${lastName}@email.com`,
      consentStatus: isPending ? "Pending" : "Approved",
      accountStatus: isPending ? "Inactive" : "Active",
      consentSubmittedAt: randDate(45),
    };
  });
