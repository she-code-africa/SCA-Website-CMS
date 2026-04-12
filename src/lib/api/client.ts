// // src/lib/api/client.ts
// import axios from "axios";
// import { toast } from "sonner";
// import { getToken } from "@/lib/auth/token";
// import { logout } from "@/lib/auth/logout";

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;

// let handlingAuthError = false;

// export const api = axios.create({
//   baseURL,
//   withCredentials: false
// });

// // api.interceptors.request.use((config) => {
// //   if (typeof window !== "undefined") {
// //     const token = getToken() || devToken || null;

// //     if (token) {
// //       // ensure headers exists
// //       config.headers = config.headers ?? {};
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //   }
// //   return config;
// // });

// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     // 1. Define routes that SHOULD NOT have a token attached
//     const publicRoutes = ["/auth/login", "/users/invite/verify"];
//     const isPublicRoute = publicRoutes.some((route) =>
//       config.url?.includes(route)
//     );

//     if (isPublicRoute) {
//       return config; // Exit early without adding headers
//     }

//     const token = getToken() || devToken;

//     if (token && typeof token === "string") {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn(`No token found for protected request: ${config.url}`);
//     }
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => {
//     // keep old behavior for logs (full payload for pagination)
//     if (response.config.url?.includes("/logs")) return response.data;

//     // default behavior
//     return response.data?.data ?? response.data;
//   },
//   (err) => {
//     const status = err?.response?.status;

//     // ✅ Global auth handling
//     if (typeof window !== "undefined" && (status === 401 || status === 403)) {
//       if (!handlingAuthError) {
//         handlingAuthError = true;

//         if (status === 401) {
//           toast.error("Session expired. Please log in again.");
//           // persist reason/details for the logout handler since logout() expects no args
//           if (typeof window !== "undefined") {
//             localStorage.setItem(
//               "logoutReason",
//               JSON.stringify({ reason: "expired", status })
//             );
//             localStorage.setItem("logoutRedirect", "/login");
//           }
//           logout();
//         } else {
//           toast.error("You don’t have permission to access this resource.");
//           if (typeof window !== "undefined") {
//             localStorage.setItem(
//               "logoutReason",
//               JSON.stringify({ reason: "forbidden", status })
//             );
//             localStorage.setItem("logoutRedirect", "/login");
//           }
//           logout();
//         }

//         // safety reset (in case user blocks redirect in dev)
//         setTimeout(() => {
//           handlingAuthError = false;
//         }, 1500);
//       }
//     }

//     return Promise.reject(err);
//   }
// );


/* version 2 of client api*/ 

// import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// import { toast } from "sonner";
// import { getToken } from "@/lib/auth/token";
// import { logout } from "@/lib/auth/logout";

// /**
//  * EXPERT NOTE: Axios naturally returns an AxiosResponse object.
//  * Since our interceptor unwraps this to return 'response.data.data',
//  * we must override the return types to avoid TypeScript errors in our features.
//  */

// /**
//  * Strict Unwrapped Instance
//  * We use 'unknown' instead of 'any' to satisfy strict linting rules.
//  */
// interface UnwrappedInstance extends AxiosInstance {
//   get<T = unknown, R = T, D = unknown>(
//     url: string, 
//     config?: AxiosRequestConfig<D>
//   ): Promise<R>;
//   post<T = unknown, R = T, D = unknown>(
//     url: string, 
//     data?: D, 
//     config?: AxiosRequestConfig<D>
//   ): Promise<R>;
//   put<T = unknown, R = T, D = unknown>(
//     url: string, 
//     data?: D, 
//     config?: AxiosRequestConfig<D>
//   ): Promise<R>;
//   patch<T = unknown, R = T, D = unknown>(
//     url: string, 
//     data?: D, 
//     config?: AxiosRequestConfig<D>
//   ): Promise<R>;
//   delete<T = unknown, R = T, D = unknown>(
//     url: string, 
//     config?: AxiosRequestConfig<D>
//   ): Promise<R>;
// }

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;

// let handlingAuthError = false;

// export const api = axios.create({
//   baseURL,
//   withCredentials: false
// }) as UnwrappedInstance;

// // ── Request Interceptor ──────────────────────────────────────────────────────
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     // Exclude public routes from token attachment
//     const publicRoutes = ["/auth/login", "/users/invite/verify"];
//     const isPublic = publicRoutes.some((path) => config.url?.includes(path));

//     if (!isPublic) {
//       const token = getToken() || devToken;
//       if (token) {
//         config.headers = config.headers ?? {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//   }
//   return config;
// });

// // ── Response Interceptor ─────────────────────────────────────────────────────
// api.interceptors.response.use(
//   (response) => {
//     // Return direct data or unwrapped 'data.data' based on backend structure
//     if (response.config.url?.includes("/logs")) return response.data;
//     return response.data?.data ?? response.data;
//   },
//   (err) => {
//     const status = err?.response?.status;

//     if (typeof window !== "undefined" && (status === 401 || status === 403)) {
//       if (!handlingAuthError) {
//         handlingAuthError = true;
//         const isExpired = status === 401;

//         toast.error(isExpired ? "Session expired." : "Access denied.", {
//           description: isExpired
//             ? "Please log in again."
//             : "You lack permissions for this resource."
//         });

//         localStorage.setItem(
//           "logoutReason",
//           JSON.stringify({
//             reason: isExpired ? "expired" : "forbidden",
//             status
//           })
//         );
//         localStorage.setItem("logoutRedirect", "/login");

//         // logout();
//         setTimeout(() => (handlingAuthError = false), 1500);
//       }
//     }
//     return Promise.reject(err);
//   }
// );


/* version 3 of client api*/ 

// // src/lib/api/client.ts
// import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// import { toast } from "sonner";
// import { getToken } from "@/lib/auth/token";
// import { logout as authLogout } from "@/lib/auth/logout";

// interface UnwrappedInstance extends AxiosInstance {
//   get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
//   post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
//   put<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
//   patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
//   delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
// }

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;
// let handlingAuthError = false;

// export const api = axios.create({
//   baseURL,
//   withCredentials: false,
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json",
//   },
// }) as UnwrappedInstance;



// // ── Move publicRoutes OUTSIDE the request interceptor so both interceptors share it ──
// const publicRoutes = [
//   "/auth/login",
//   "/users/accept",   // invite verify + accept
//   "/users/decline",  // invite decline
// ];

// // ── Request interceptor — unchanged logic, just uses the shared array ──
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = getToken() || devToken;
//     const isPublic = publicRoutes.some((route) => config.url?.includes(route));
//     if (token && !isPublic) {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// // ── Response interceptor ──
// api.interceptors.response.use(
//   (response) => {
//     if (response.config.url?.includes("/logs")) return response.data;
//     if (/\/users(\?.*)?$/.test(response.config.url ?? "")) return response.data;

//     const responseBody = response.data;
//     if (responseBody && typeof responseBody === "object" && "data" in responseBody) {
//       return responseBody.data;
//     }
//     return responseBody;
//   },
//   (err) => {
//     const status = err?.response?.status;
//     const requestUrl = err.config?.url ?? "";
//     const backendMessage = err?.response?.data?.message;
//     const message = backendMessage || "You do not have permission to perform this action.";

//     // ── KEY FIX: never trigger logout for public routes ────────────────────
//     // /users/accept returns 401 when the invitee has no token — that's expected.
//     // Redirecting to /login here would break the invite flow entirely.
//     const isPublicUrl = publicRoutes.some((route) => requestUrl.includes(route));

//     if (typeof window !== "undefined" && !isPublicUrl) {
//       if (status === 401) {
//         if (!handlingAuthError) {
//           handlingAuthError = true;
//           toast.error("Session expired", {
//             description: "Please log in again to continue."
//           });
//           authLogout();
//           setTimeout(() => (handlingAuthError = false), 2000);
//         }
//       } else if (status === 403) {
//         toast.error("Permission Denied", { description: message });
//         console.error(`[403 Forbidden] Path: ${requestUrl}`, err.response?.data);
//       }
//     }

//     return Promise.reject(err);
//   }
// );



// src/lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getToken } from "@/lib/auth/token";
import { logout as authLogout } from "@/lib/auth/logout";

interface UnwrappedInstance extends AxiosInstance {
  get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}

/**
 * DETERMINISTIC BASE URL
 * In the browser: Use /api/external (proxied via next.config.ts) to bypass CORS.
 * On the server: Talk to Heroku directly (Servers don't have CORS issues).
 */
const HEROKU_URL = "https://rbac-be-0de7ff4ed1ef.herokuapp.com/api";
const PROXY_PATH = "/api/external";

const baseURL = typeof window === "undefined" ? HEROKU_URL : PROXY_PATH;

const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;
let handlingAuthError = false;

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
}) as UnwrappedInstance;

const publicRoutes = [
  "/auth/login",
  "/users/accept",   
  "/users/decline",  
];

// ── Request interceptor ──
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken() || devToken;
    const isPublic = publicRoutes.some((route) => config.url?.includes(route));
    if (token && !isPublic) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor ──
api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes("/logs")) return response.data;
    if (/\/users(\?.*)?$/.test(response.config.url ?? "")) return response.data;

    const responseBody = response.data;
    if (responseBody && typeof responseBody === "object" && "data" in responseBody) {
      return responseBody.data;
    }
    return responseBody;
  },
  (err) => {
    const status = err?.response?.status;
    const requestUrl = err.config?.url ?? "";
    const backendMessage = err?.response?.data?.message;
    const message = backendMessage || "You do not have permission to perform this action.";

    const isPublicUrl = publicRoutes.some((route) => requestUrl.includes(route));

    if (typeof window !== "undefined" && !isPublicUrl) {
      if (status === 401) {
        if (!handlingAuthError) {
          handlingAuthError = true;
          toast.error("Session expired", {
            description: "Please log in again to continue."
          });
          authLogout();
          setTimeout(() => (handlingAuthError = false), 2000);
        }
      } else if (status === 403) {
        toast.error("Permission Denied", { description: message });
        console.error(`[403 Forbidden] Path: ${requestUrl}`, err.response?.data);
      }
    }

    return Promise.reject(err);
  }
);