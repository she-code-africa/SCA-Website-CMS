// "use client";

// import * as React from "react";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// import { ThemeProvider } from "@/components/providers/theme-provider";
// import { QueryProvider } from "@/components/providers/react-query-provider";
// import { Toaster } from "@/components/ui/sonner";

// export function AppProviders({ children }: { children: React.ReactNode }) {
//   const clientId = process.env.NEXT_PUBLIC_GA_CLIENT_ID;

//   // If GA env is missing, don't crash the app — just run without GA provider.
//   if (!clientId) {
//     if (typeof window !== "undefined") {
//       // eslint-disable-next-line no-console
//       console.warn(
//         "NEXT_PUBLIC_GA_CLIENT_ID is missing — Google OAuth disabled."
//       );
//     }

//     return (
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <QueryProvider>
//           {children}
//           <Toaster richColors position="top-right" />
//         </QueryProvider>
//       </ThemeProvider>
//     );
//   }

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <QueryProvider>
//           {children}
//           <Toaster richColors position="top-right" />
//         </QueryProvider>
//       </ThemeProvider>
//     </GoogleOAuthProvider>
//   );
// }

"use client";

import * as React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GA_CLIENT_ID;

  // We define a wrapper that only renders GoogleOAuthProvider if clientId exists.
  // However, to keep the React Hook tree stable, it's better to always render
  // the same hierarchy if possible, or handle the conditional logic carefully.

  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}