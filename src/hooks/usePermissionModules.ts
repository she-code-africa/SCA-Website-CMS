// src/hooks/usePermissionModules.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/features/roles/api";

// Only the five standard actions we use in the UI
const ALLOWED_ACTIONS = new Set([
  "VIEW",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT"
]);

export const ACTION_LABELS = {
  VIEW: "View",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  EXPORT: "Export"
} as const;

export const ACTION_COLUMNS = [
  "VIEW",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT"
] as const;

export function usePermissionModules() {
  const { data: rawPermissions = [], isLoading } = useQuery({
    queryKey: ["all-permissions"],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000
  });

  const { modules, actions } = useMemo(() => {
    // Normalize to array of strings (permission names)
    const permissionStrings = rawPermissions.map((p) =>
      typeof p === "string" ? p : (p as any).name
    );

    // Filter to only allowed actions
    const permissions = permissionStrings.filter((perm) => {
      const action = perm.split("_")[0];
      return ALLOWED_ACTIONS.has(action);
    });

    const moduleMap = new Map<string, Map<string, string[]>>();
    const actionSet = new Set<string>();

    for (const perm of permissions) {
      const [action, ...parts] = perm.split("_");
      const moduleName = parts.join("_");
      actionSet.add(action);
      if (!moduleMap.has(moduleName)) moduleMap.set(moduleName, new Map());
      const actionMap = moduleMap.get(moduleName)!;
      if (!actionMap.has(action)) actionMap.set(action, []);
      actionMap.get(action)!.push(perm);
    }

    const modulesList = Array.from(moduleMap.entries()).map(
      ([module, actionMap]) => ({
        key: module,
        label: module
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        permissions: Array.from(actionMap.values()).flat()
      })
    );

    // Sort actions using a predefined order (no type assertion needed)
    const actionOrder: Record<string, number> = {
      VIEW: 0,
      CREATE: 1,
      UPDATE: 2,
      DELETE: 3,
      EXPORT: 4
    };
    const actionsList = Array.from(actionSet).sort(
      (a, b) => actionOrder[a] - actionOrder[b]
    );

    return { modules: modulesList, actions: actionsList };
  }, [rawPermissions]);

  return { modules, actions, isLoading };
}

// // src/hooks/usePermissionModules.ts

// import { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getPermissions } from "@/features/roles/api";

// export const ACTION_LABELS = {
//   VIEW: "View",
//   CREATE: "Create",
//   UPDATE: "Update",
//   DELETE: "Delete",
//   EXPORT: "Export",
// } as const;

// export const ACTION_COLUMNS = ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"] as const;

// export function usePermissionModules() {
//   const { data: rawPermissions = [], isLoading } = useQuery({
//     queryKey: ["all-permissions"],
//     queryFn: getPermissions,
//     staleTime: 5 * 60 * 1000,
//   });

//   const { modules, actions } = useMemo(() => {
//     // Normalize to array of strings (permission names)
//     const permissions = rawPermissions.map((p) => (typeof p === "string" ? p : p.name));

//     const moduleMap = new Map<string, Map<string, string[]>>();
//     const actionSet = new Set<string>();

//     for (const perm of permissions) {
//       if (!perm.includes("_")) continue;
//       const [action, ...parts] = perm.split("_");
//       const moduleName = parts.join("_");
//       actionSet.add(action);
//       if (!moduleMap.has(moduleName)) moduleMap.set(moduleName, new Map());
//       const actionMap = moduleMap.get(moduleName)!;
//       if (!actionMap.has(action)) actionMap.set(action, []);
//       actionMap.get(action)!.push(perm);
//     }

//     const modulesList = Array.from(moduleMap.entries()).map(([module, actionMap]) => ({
//       key: module,
//       label: module.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
//       permissions: Array.from(actionMap.values()).flat(),
//     }));

//     const actionsList = Array.from(actionSet).sort();
//     return { modules: modulesList, actions: actionsList };
//   }, [rawPermissions]);

//   return { modules, actions, isLoading };
// }
