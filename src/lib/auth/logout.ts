// // src/lib/auth/logout.ts
// import { clearToken } from "./token";
// import { clearLoggedInCookie } from "./session";

// interface LogoutOptions {
//   reason?: string;
//   redirectTo?: string;
// }

// export function logout(options?: LogoutOptions) {
//   clearLoggedInCookie();
//   clearToken();

//   if (typeof window !== "undefined") {
//     // Use the provided redirect path, or default to "/login"
//     const destination = options?.redirectTo || "/login";
//     window.location.href = destination;
//   }
// }



// src/lib/auth/logout.ts
import { clearToken } from "./token";
import { clearLoggedInCookie } from "./session";

interface LogoutOptions {
  reason?: string;
  redirectTo?: string;
}

export function logout(options?: LogoutOptions) {
  clearLoggedInCookie();
  clearToken();

  if (typeof window !== "undefined") {
    const destination = options?.redirectTo || "/login";
    // Use replace with a cache-busting timestamp
    window.location.replace(destination + "?_=" + new Date().getTime());
  }
}