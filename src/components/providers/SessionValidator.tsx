// src/components/providers/SessionValidator.tsx
"use client";

import { useSessionValidator } from "@/hooks/useSessionValidator";

export function SessionValidator() {
  // This runs the 60-second interval and focus check globally for this layout
  useSessionValidator();
  return null; // It renders nothing
}
