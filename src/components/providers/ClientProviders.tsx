// src/components/providers/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { AppProviders } from "./app-providers"; // your existing providers component

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
