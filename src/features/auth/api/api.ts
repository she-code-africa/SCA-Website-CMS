// src/features/auth/api/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Auth Feature API
// ─────────────────────────────────────────────────────────────────────────────

import { api } from "@/lib/api/client";
import { LoginPayload, LoginResponse } from "@/features/auth";
import { logout as authLogout } from "@/lib/auth/logout";

/**
 * Executes login request and extracts the token.
 * Note: Browser storage (Cookies/LocalStorage) is managed in the UI component
 * to handle 'Remember Me' preferences.
 */
export async function login(payload: LoginPayload): Promise<string> {
  // interceptor returns `response.data?.data ?? response.data`
  const res = (await api.post<LoginResponse>(
    "/auth/login",
    payload
  )) as unknown;

  // if interceptor returned token directly
  if (typeof res === "string") return res;

  // if interceptor returned full object { success, data }
  const token = (res as LoginResponse).data;
  if (typeof token === "string" && token.length > 10) return token;

  throw new Error("Login failed: token not returned from backend");
}

/**
 * Triggers the core logout utility to clear cookies,
 * local storage, and redirect the user.
 */
export async function logout(): Promise<void> {
  authLogout();
}

export type InviteTokenStatus =
  | { valid: true; email: string; name?: string }
  | { valid: false; expired: boolean; reason: string };

export type AcceptInvitePayload = {
  token: string;
  password: string;
};

// ── Mock implementations ──────────────────────────────────────────────────────
const IS_MOCK = true;

export async function verifyInviteToken(
  token: string
): Promise<InviteTokenStatus> {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    if (token === "expired") {
      return {
        valid: false,
        expired: true,
        reason: "This invitation link has expired."
      };
    }
    if (token === "invalid") {
      return {
        valid: false,
        expired: false,
        reason: "This invitation link is invalid or has already been used."
      };
    }
    return {
      valid: true,
      email: "invited.user@shecodeafrica.org",
      name: "Invited User"
    };
  }

  // REAL:
  // return api.get<InviteTokenStatus>(`/auth/invite/verify?token=${token}`);
  throw new Error("Not implemented");
}

export async function acceptInvite(
  payload: AcceptInvitePayload
): Promise<void> {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 1000));
    return;
  }

  // REAL:
  // return api.post("/auth/invite/accept", payload);
  throw new Error("Not implemented");
}
