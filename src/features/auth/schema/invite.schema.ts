//src/features/auth/schema/invite.schema.ts
import { z } from "zod";

// ─── Individual password rules ────────────────────────────────────────────────
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (v: string) => v.length >= 8
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A–Z)",
    test: (v: string) => /[A-Z]/.test(v)
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a–z)",
    test: (v: string) => /[a-z]/.test(v)
  },
  {
    id: "number",
    label: "One number (0–9)",
    test: (v: string) => /[0-9]/.test(v)
  },
  {
    id: "special",
    label: "One special character (!@#…)",
    test: (v: string) => /[^A-Za-z0-9]/.test(v)
  }
] as const;

// ─── Password strength ────────────────────────────────────────────────────────
// Using numbers 0-5 for easier array mapping in the UI
export type StrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return 0;
  return PASSWORD_RULES.filter((r) => r.test(password)).length as StrengthLevel;
}

export const STRENGTH_CONFIG: Record<
  StrengthLevel,
  { label: string; color: string; barColor: string }
> = {
  0: { label: "", color: "text-slate-500", barColor: "bg-slate-700" },
  1: { label: "Very Weak", color: "text-red-500", barColor: "bg-red-600" },
  2: { label: "Weak", color: "text-orange-500", barColor: "bg-orange-500" },
  3: { label: "Fair", color: "text-amber-400", barColor: "bg-amber-400" },
  4: { label: "Good", color: "text-blue-400", barColor: "bg-blue-400" },
  5: { label: "Strong", color: "text-emerald-400", barColor: "bg-emerald-500" }
};

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Renamed to inviteAcceptSchema to fix your component error
export const inviteAcceptSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(50),
    lastName: z.string().trim().min(1, "Last name is required").max(50),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

// Renamed to InviteAcceptInput to fix your component error
export type InviteAcceptInput = z.infer<typeof inviteAcceptSchema>;
