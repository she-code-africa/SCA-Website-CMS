// src/lib/store/useRoleStore.ts
import { create } from "zustand";

interface RoleState {
  currentRole: string | null;
  setRole: (role: string | null) => void;
  clearRole: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  currentRole: null,
  setRole: (role) => set({ currentRole: role }),
  clearRole: () => set({ currentRole: null })
}));
