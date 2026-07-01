 // src/features/auth/api/api.ts
import { api } from "@/lib/api/client";
import { logout as authLogout } from "@/lib/auth/logout";
import type {
  LoginPayload,
  LoginResponse,
  AcceptInvitePayload,
  DeclineInvitePayload
  // InviteTokenStatus,
  // InviteVerifyResponse,
} from "@/features/auth/types";

// ── Login ─────────────────────────────────────────────────────────────────────
export async function login(payload: LoginPayload): Promise<string> {
  const res = (await api.post<LoginResponse>(
    "/auth/login",
    payload
  )) as unknown;
  if (typeof res === "string") return res;
  const token = (res as LoginResponse).data;
  if (typeof token === "string" && token.length > 10) return token;
  throw new Error("Login failed: token not returned from backend");
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  authLogout();
}

// ── Invite — Verify token (READ‑ONLY) ───────────────────────────────────────
// GET /users/invite/verify?token=xxx
// NOTE: This endpoint is not yet available on the backend. Uncomment when ready.
/*
export async function verifyInviteToken(token: string): Promise<InviteTokenStatus> {
  try {
    const res = await api.get<InviteVerifyResponse>(`/users/invite/verify?token=${token}`);
    const payload = (res as any)?.data ?? res;
    if (!payload?.valid) {
      return {
        valid: false,
        expired: payload?.expired === true,
        reason: payload?.reason || "Invalid invitation link.",
      };
    }
    return {
      valid: true,
      email: payload.email || "",
      name: payload.name,
    };
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 410) {
      return { valid: false, expired: true, reason: "This invitation link has expired." };
    }
    if (status === 404 || status === 400) {
      return { valid: false, expired: false, reason: "Invalid or already used link." };
    }
    return { valid: false, expired: false, reason: "Verification failed. Please try again." };
  }
}
*/

// ── Invite — Accept ───────────────────────────────────────────────────────────
export async function acceptInvite(
  payload: AcceptInvitePayload
): Promise<void> {
  await api.post("/users/accept", payload);
}

// ── Invite — Decline ──────────────────────────────────────────────────────────
// POST /users/decline
// Body: { token }
export async function declineInvite(token: string): Promise<void> {
  const payload: DeclineInvitePayload = { token };
  await api.post("/users/decline", payload);
}
