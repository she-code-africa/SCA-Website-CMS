// src/lib/auth/logout.ts
import { clearToken } from "./token";
import { clearLoggedInCookie } from "./session";

export function logout() {
  clearLoggedInCookie();
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login"; // This "hard" redirect is safest for session expiration
  }
}
