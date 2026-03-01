// src/lib/auth/logout.ts
import { clearToken } from "./token";
import { clearLoggedInCookie } from "./session";

export function logout() {
  clearLoggedInCookie();
  clearToken();

  // optional cleanup
  if (typeof window !== "undefined") {
    localStorage.removeItem("rememberedEmail");
  }
}
