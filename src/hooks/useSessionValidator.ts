// src/hooks/useSessionValidator.ts
import { useEffect } from "react";
import { decodeJwt } from "@/lib/auth/jwt";
import { clearToken, getToken } from "@/lib/auth/token";
import { clearLoggedInCookie } from "@/lib/auth/session";

// export function useSessionValidator() {
//   useEffect(() => {
//     const checkTokenExpiry = () => {
//       const token = getToken();
//       if (!token) return;

//       // Use the exact same decoder we use in AuthContext
//       const decoded = decodeJwt<{ exp: number }>(token);
//       if (!decoded) return;

//       const currentTime = Math.floor(Date.now() / 1000);

//       if (decoded.exp < currentTime) {
//         clearToken();
//         clearLoggedInCookie();
//         window.location.replace("/login?_=" + new Date().getTime());
//       }
//     };

//     checkTokenExpiry();
//     const intervalId = setInterval(checkTokenExpiry, 60 * 1000);
//     window.addEventListener('focus', checkTokenExpiry);

//     return () => {
//       clearInterval(intervalId);
//       window.removeEventListener('focus', checkTokenExpiry);
//     };
//   }, []);
// }

export function useSessionValidator() {
  useEffect(() => {
    let hasRedirected = false;

    const checkTokenExpiry = () => {
      if (hasRedirected) return;
      const token = getToken();
      if (!token) return;

      const decoded = decodeJwt<{ exp: number }>(token);
      if (!decoded) return;

      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        hasRedirected = true;
        clearToken();
        clearLoggedInCookie();
        window.location.replace("/login?_=" + Date.now());
      }
    };

    checkTokenExpiry();
    const intervalId = setInterval(checkTokenExpiry, 60 * 1000);
    window.addEventListener("focus", checkTokenExpiry);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", checkTokenExpiry);
    };
  }, []);
}