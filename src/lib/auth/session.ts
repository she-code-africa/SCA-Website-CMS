// src/lib/auth/session.ts
import Cookies from "js-cookie";

export const LOGGED_IN_COOKIE = "isLoggedIn";

export function setLoggedInCookie(expiresDays: number) {
  Cookies.set(LOGGED_IN_COOKIE, "true", { expires: expiresDays, path: "/" });
}

export function clearLoggedInCookie() {
  // Explicitly pass path: "/" to ensure it is removed across the entire site
  Cookies.remove(LOGGED_IN_COOKIE, { path: "/" });
}
