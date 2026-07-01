// src/lib/auth/session.ts
import Cookies from "js-cookie";

export const LOGGED_IN_COOKIE = "isLoggedIn";

export function setLoggedInCookie(expiresDays: number) {
  Cookies.set(LOGGED_IN_COOKIE, "true", { expires: expiresDays });
}

export function clearLoggedInCookie() {
  Cookies.remove(LOGGED_IN_COOKIE);
}
