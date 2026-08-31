// // src/hooks/usePermissionModules.ts

// "use client"
// import { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getPermissions } from "@/features/roles/api";

// // Only the five standard actions we use in the UI
// const ALLOWED_ACTIONS = new Set([
//   "VIEW",
//   "CREATE",
//   "UPDATE",
//   "DELETE",
//   "EXPORT"
// ]);

// export const ACTION_LABELS = {
//   VIEW: "View",
//   CREATE: "Create",
//   UPDATE: "Update",
//   DELETE: "Delete",
//   EXPORT: "Export"
// } as const;

// export const ACTION_COLUMNS = [
//   "VIEW",
//   "CREATE",
//   "UPDATE",
//   "DELETE",
//   "EXPORT"
// ] as const;

// export function usePermissionModules() {
//   const { data: rawPermissions = [], isLoading } = useQuery({
//     queryKey: ["all-permissions"],
//     queryFn: getPermissions,
//     staleTime: 5 * 60 * 1000
//   });

//   console.log(rawPermissions)

//   const { modules, actions } = useMemo(() => {
//     // Normalize to array of strings (permission names)
//     const permissionStrings = rawPermissions.map((p) =>
//       typeof p === "string" ? p : (p as any).name
//     );

//     // Filter to only allowed actions
//     const permissions = permissionStrings.filter((perm) => {
//       const action = perm.split("_")[0];
//       return ALLOWED_ACTIONS.has(action);
//     });

//     const moduleMap = new Map<string, Map<string, string[]>>();
//     const actionSet = new Set<string>();

//     for (const perm of permissions) {
//       const [action, ...parts] = perm.split("_");
//       const moduleName = parts.join("_");
//       actionSet.add(action);
//       if (!moduleMap.has(moduleName)) moduleMap.set(moduleName, new Map());
//       const actionMap = moduleMap.get(moduleName)!;
//       if (!actionMap.has(action)) actionMap.set(action, []);
//       actionMap.get(action)!.push(perm);
//     }

//     const modulesList = Array.from(moduleMap.entries()).map(
//       ([module, actionMap]) => ({
//         key: module,
//         label: module
//           .replace(/_/g, " ")
//           .toLowerCase()
//           .replace(/\b\w/g, (c) => c.toUpperCase()),
//         permissions: Array.from(actionMap.values()).flat()
//       })
//     );

//     // Sort actions using a predefined order (no type assertion needed)
//     const actionOrder: Record<string, number> = {
//       VIEW: 0,
//       CREATE: 1,
//       UPDATE: 2,
//       DELETE: 3,
//       EXPORT: 4
//     };
//     const actionsList = Array.from(actionSet).sort(
//       (a, b) => actionOrder[a] - actionOrder[b]
//     );

//     return { modules: modulesList, actions: actionsList };
//   }, [rawPermissions]);

//   return { modules, actions, isLoading };
// }

// // // src/hooks/usePermissionModules.ts

// // import { useMemo } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import { getPermissions } from "@/features/roles/api";

// // export const ACTION_LABELS = {
// //   VIEW: "View",
// //   CREATE: "Create",
// //   UPDATE: "Update",
// //   DELETE: "Delete",
// //   EXPORT: "Export",
// // } as const;

// // export const ACTION_COLUMNS = ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"] as const;

// // export function usePermissionModules() {
// //   const { data: rawPermissions = [], isLoading } = useQuery({
// //     queryKey: ["all-permissions"],
// //     queryFn: getPermissions,
// //     staleTime: 5 * 60 * 1000,
// //   });

// //   const { modules, actions } = useMemo(() => {
// //     // Normalize to array of strings (permission names)
// //     const permissions = rawPermissions.map((p) => (typeof p === "string" ? p : p.name));

// //     const moduleMap = new Map<string, Map<string, string[]>>();
// //     const actionSet = new Set<string>();

// //     for (const perm of permissions) {
// //       if (!perm.includes("_")) continue;
// //       const [action, ...parts] = perm.split("_");
// //       const moduleName = parts.join("_");
// //       actionSet.add(action);
// //       if (!moduleMap.has(moduleName)) moduleMap.set(moduleName, new Map());
// //       const actionMap = moduleMap.get(moduleName)!;
// //       if (!actionMap.has(action)) actionMap.set(action, []);
// //       actionMap.get(action)!.push(perm);
// //     }

// //     const modulesList = Array.from(moduleMap.entries()).map(([module, actionMap]) => ({
// //       key: module,
// //       label: module.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
// //       permissions: Array.from(actionMap.values()).flat(),
// //     }));

// //     const actionsList = Array.from(actionSet).sort();
// //     return { modules: modulesList, actions: actionsList };
// //   }, [rawPermissions]);

// //   return { modules, actions, isLoading };
// // }

// src/hooks/usePermissionModules.ts
"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/features/roles/api";

// Kept exported in case anything else in the app still imports these.
export const ACTION_LABELS = {
  VIEW: "View",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  EXPORT: "Export",
} as const;

export const ACTION_COLUMNS = ["VIEW", "CREATE", "UPDATE", "DELETE", "EXPORT"] as const;

// "read_x" and "VIEW_X" mean the same thing, just written by two
// different permission-naming conventions in the DB. Merge them into
// one column instead of showing two near-duplicate ones.
const ACTION_ALIASES: Record<string, string> = {
  READ: "VIEW",
};

// Controls left-to-right column order. Anything not listed here still
// shows up (sorted alphabetically after these) instead of being
// silently dropped — that's what was happening to PUBLISH/ARCHIVE.
const ACTION_ORDER: Record<string, number> = {
  VIEW: 0,
  CREATE: 1,
  UPDATE: 2,
  MANAGE: 2.5,
  DELETE: 3,
  EXPORT: 4,
  PUBLISH: 5,
  ARCHIVE: 6,
};

export type PermissionModule = {
  key: string;
  label: string;
  permissions: string[]; // every raw permission name in this module
  permsByAction: Record<string, string>; // action -> raw permission name
};

export function usePermissionModules() {
  const { data: rawPermissions = [], isLoading } = useQuery({
    queryKey: ["all-permissions"],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000,
  });

  const { modules, actions } = useMemo(() => {
    const permissionStrings: string[] = rawPermissions
      .map((p: any) => (typeof p === "string" ? p : p?.name))
      .filter(Boolean);

    const moduleMap = new Map<string, Map<string, string>>();
    const actionSet = new Set<string>();

    for (const perm of permissionStrings) {
      const separatorIndex = perm.indexOf("_");
      if (separatorIndex === -1) continue; // not ACTION_MODULE shaped

      const rawAction = perm.slice(0, separatorIndex).toUpperCase();
      const action = ACTION_ALIASES[rawAction] ?? rawAction;
      const moduleKey = perm.slice(separatorIndex + 1).toUpperCase();

      actionSet.add(action);

      if (!moduleMap.has(moduleKey)) moduleMap.set(moduleKey, new Map());
      const actionMap = moduleMap.get(moduleKey)!;
      if (!actionMap.has(action)) actionMap.set(action, perm);
    }

    const modulesList: PermissionModule[] = Array.from(moduleMap.entries()).map(
      ([moduleKey, actionMap]) => ({
        key: moduleKey,
        label: moduleKey
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        permsByAction: Object.fromEntries(actionMap),
        permissions: Array.from(actionMap.values()),
      })
    );

    const actionsList = Array.from(actionSet).sort((a, b) => {
      const pa = ACTION_ORDER[a] ?? 99;
      const pb = ACTION_ORDER[b] ?? 99;
      return pa !== pb ? pa - pb : a.localeCompare(b);
    });

    return { modules: modulesList, actions: actionsList };
  }, [rawPermissions]);

  return { modules, actions, isLoading };
}