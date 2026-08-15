// // src/features/roles/components/role-sheet.tsx
// "use client";

// import * as React from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { Info, Lock, Loader2 } from "lucide-react";
// import { createRole, updateRole } from "@/features/roles/api";
// import type { RoleDetail } from "@/features/roles/types";
// import { PERMISSIONS } from "@/lib/rbac/permissions";
// import { useRoleUserCounts } from "@/hooks/useRoleUserCounts";
// import { usePermissionModules } from "@/hooks/usePermissionModules";
// import { PermissionMatrix } from "./PermissionMatrix";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { PermissionGate } from "@/components/PermissionGate";

// type Props = {
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   mode: "create" | "view";
//   role?: RoleDetail | null;
//   onUpdate?: () => Promise<void>; // simplified – no argument needed
// };

// // Helper to flatten permissions from role (unchanged)
// function normalizeRolePermissions(role: RoleDetail): Set<string> {
//   const perms = role.permissions as Array<string | { name: string }>;
//   const set = new Set<string>();
//   perms.forEach((p) => {
//     const str = typeof p === "string" ? p : p?.name;
//     if (
//       str &&
//       str === str.toUpperCase() &&
//       !str.startsWith("read_") &&
//       !str.startsWith("manage_")
//     ) {
//       set.add(str);
//     } else if (str?.startsWith("read_")) {
//       const entity = str
//         .replace("read_", "")
//         .replace(/([A-Z])/g, "_$1")
//         .toUpperCase();
//       set.add(`VIEW_${entity}`);
//     } else if (str?.startsWith("manage_")) {
//       const entity = str
//         .replace("manage_", "")
//         .replace(/([A-Z])/g, "_$1")
//         .toUpperCase();
//       set.add(`VIEW_${entity}`);
//       set.add(`CREATE_${entity}`);
//       set.add(`UPDATE_${entity}`);
//       set.add(`DELETE_${entity}`);
//     }
//   });
//   return set;
// }

// export function RoleSheet({ open, onOpenChange, mode, role, onUpdate }: Props) {
//   const qc = useQueryClient();
//   const {
//     modules,
//     actions,
//     isLoading: isLoadingPerms,
//   } = usePermissionModules();
//   const { data: roleUserCounts, isLoading: isLoadingCounts } =
//     useRoleUserCounts();

//   const effectiveRole = role;
//   const userCount = roleUserCounts?.get(effectiveRole?._id ?? "") ?? 0;
//   const isSystemRole = effectiveRole?.is_system_role ?? false;

//   const [editing, setEditing] = React.useState(false);
//   const [name, setName] = React.useState("");
//   const [description, setDescription] = React.useState("");
//   const [selectedPerms, setSelectedPerms] = React.useState<Set<string>>(
//     new Set(),
//   );
//   const [originalPerms, setOriginalPerms] = React.useState<Set<string>>(
//     new Set(),
//   );
//   const [nameError, setNameError] = React.useState("");

//   // Reset and populate when sheet opens / role changes
//   React.useEffect(() => {
//     if (!open) {
//       setNameError("");
//       setEditing(false);
//       return;
//     }
//     if (mode === "create") {
//       setEditing(true);
//       setName("");
//       setDescription("");
//       setSelectedPerms(new Set());
//       setOriginalPerms(new Set());
//     }
//     if (mode === "view" && effectiveRole) {
//       setEditing(false);
//       setName(effectiveRole.name);
//       setDescription(effectiveRole.description);
//       const perms = normalizeRolePermissions(effectiveRole);
//       setSelectedPerms(perms);
//       setOriginalPerms(new Set(perms));
//     }
//   }, [open, mode, effectiveRole]);

//   const createMut = useMutation({
//     mutationFn: createRole,
//     onSuccess: async () => {
//       toast.success("Role created successfully.");
//       qc.invalidateQueries({ queryKey: ["roles"] });
//       await onUpdate?.();
//       onOpenChange(false);
//     },
//     onError: (err: Error) =>
//       toast.error(err.message ?? "Could not create role."),
//   });

//   const updateMut = useMutation({
//     mutationFn: ({
//       id,
//       original,
//       updated,
//     }: {
//       id: string;
//       original: Set<string>;
//       updated: Set<string>;
//     }) => {
//       const permissions = Array.from(updated);
//       return updateRole(id, { name, description, permissions });
//     },
//     onSuccess: async () => {
//       toast.success("Role updated.");
//       // Immediately update local state to reflect the saved values
//       setName(name); // already the new value
//       setDescription(description);
//       setEditing(false);
//       // Then trigger the refetch / skeleton in the parent
//       await onUpdate?.();
//       qc.invalidateQueries({ queryKey: ["roles"] });
//     },
//     onError: (err: Error) =>
//       toast.error(err.message ?? "Could not update role."),
//   });

//   const handleSubmit = () => {
//     setNameError("");
//     if (!name.trim()) {
//       setNameError("Role name is required.");
//       return;
//     }
//     if (selectedPerms.size === 0) {
//       toast.error("Please select at least one permission.");
//       return;
//     }

//     const permissions = Array.from(selectedPerms);
//     if (mode === "create") {
//       createMut.mutate({ name: name.trim(), description, permissions });
//     } else if (effectiveRole) {
//       const roleId = effectiveRole.id || effectiveRole._id;
//       if (!roleId) {
//         toast.error("Failed to update: Role ID is missing.");
//         return;
//       }
//       updateMut.mutate({
//         id: roleId,
//         original: originalPerms,
//         updated: selectedPerms,
//       });
//     }
//   };

//   const saving = createMut.isPending || updateMut.isPending;
//   const isReadOnly = mode === "view" && (isSystemRole || !editing);
//   const canEditCustom = mode === "view" && !isSystemRole;

//   // Loading skeleton (unchanged)
//   if (
//     mode === "view" &&
//     (isLoadingCounts || isLoadingPerms) &&
//     !effectiveRole
//   ) {
//     return (
//       <Sheet open={open} onOpenChange={onOpenChange}>
//         <SheetContent
//           side="right"
//           className="w-full sm:max-w-3xl p-0 flex flex-col"
//         >
//           <SheetHeader className="px-6 py-4 border-b">
//             <Skeleton className="h-6 w-40" />
//             <Skeleton className="h-4 w-64 mt-1" />
//           </SheetHeader>
//           <div className="space-y-6 p-6">
//             <Skeleton className="h-10 w-full" />
//             <Skeleton className="h-10 w-full" />
//             <Skeleton className="h-32 w-full" />
//           </div>
//         </SheetContent>
//       </Sheet>
//     );
//   }

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="w-full sm:max-w-3xl p-0 flex flex-col"
//       >
//         <SheetHeader className="px-6 py-4 border-b space-y-1 shrink-0">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <SheetTitle>
//                 {mode === "create"
//                   ? "Create Role"
//                   : ((name || effectiveRole?.name) ?? "Role")}
//               </SheetTitle>
//               <SheetDescription>
//                 {mode === "create"
//                   ? "Define a custom role with specific permissions."
//                   : isSystemRole
//                     ? "System roles cannot have existing permissions removed. You can add new permissions below."
//                     : "Edit this role's permissions."}
//               </SheetDescription>
//             </div>
//             {mode === "view" && effectiveRole && (
//               <Badge
//                 variant={isSystemRole ? "secondary" : "outline"}
//                 className="shrink-0 mt-1"
//               >
//                 {isSystemRole ? (
//                   <>
//                     <Lock className="h-3 w-3 mr-1" /> System
//                   </>
//                 ) : (
//                   "Custom"
//                 )}
//               </Badge>
//             )}
//           </div>
//         </SheetHeader>

//         <ScrollArea className="flex-1 px-6">
//           <div className="py-6 space-y-6">
//             {/* Edit button for custom roles */}
//             {mode === "view" && canEditCustom && (
//               <div className="flex justify-end">
//                 <PermissionGate permission={PERMISSIONS.UPDATE_ROLE}>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setEditing((v) => !v)}
//                   >
//                     {editing ? "Cancel editing" : "Edit role"}
//                   </Button>
//                 </PermissionGate>
//               </div>
//             )}

//             {mode === "view" && isSystemRole && (
//               <div className="flex items-start gap-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
//                 <Info className="h-4 w-4 shrink-0 mt-0.5" />
//                 <span>
//                   System roles have fixed core permissions. You can{" "}
//                   <strong>add new permissions</strong> below (checkboxes are
//                   enabled for permissions not already assigned). Once added,
//                   they cannot be removed.
//                 </span>
//               </div>
//             )}

//             <section>
//               <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//                 General Information
//               </label>
//               <div className="grid gap-4 sm:grid-cols-2 mt-2">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">
//                     Role Name <span className="text-destructive">*</span>
//                   </label>
//                   <Input
//                     disabled={isReadOnly}
//                     value={name}
//                     onChange={(e) => {
//                       setName(e.target.value);
//                       setNameError("");
//                     }}
//                     className={nameError ? "border-destructive" : ""}
//                   />
//                   {nameError && (
//                     <p className="text-[10px] text-destructive">{nameError}</p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-muted-foreground">
//                     Active Members
//                   </label>
//                   <div className="h-10 flex items-center px-3 rounded-md bg-muted/30 border border-dashed text-sm font-medium">
//                     {isLoadingCounts ? (
//                       <Skeleton className="h-4 w-16" />
//                     ) : (
//                       `${userCount} user(s) assigned`
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <label className="text-sm font-medium">Scope Description</label>
//                 <Input
//                   disabled={isReadOnly}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="What can users with this role do?"
//                 />
//               </div>
//             </section>

//             <Separator />

//             <div>
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <p className="text-sm font-medium">Permissions</p>
//                   <p className="text-xs text-muted-foreground">
//                     {isReadOnly
//                       ? `${selectedPerms.size} permissions granted.`
//                       : "Select actions for each module."}
//                   </p>
//                 </div>
//                 {!isReadOnly && (
//                   <div className="flex items-center gap-2">
//                     <Badge variant="secondary">
//                       {selectedPerms.size} selected
//                     </Badge>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setSelectedPerms(new Set())}
//                       disabled={selectedPerms.size === 0}
//                     >
//                       Clear all
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               {isLoadingPerms ? (
//                 <div className="space-y-3">
//                   <Skeleton className="h-10 w-full" />
//                   <Skeleton className="h-64 w-full" />
//                 </div>
//               ) : (
//                 <PermissionMatrix
//                   selected={selectedPerms}
//                   onChange={setSelectedPerms}
//                   readOnly={isReadOnly}
//                   modules={modules}
//                   actions={actions}
//                 />
//               )}
//             </div>
//           </div>
//         </ScrollArea>

//         {(mode === "create" || (mode === "view" && editing)) && (
//           <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 if (mode === "view") {
//                   setEditing(false);
//                   if (effectiveRole) {
//                     setName(effectiveRole.name);
//                     setDescription(effectiveRole.description);
//                     setSelectedPerms(new Set(originalPerms));
//                   }
//                 } else {
//                   onOpenChange(false);
//                 }
//               }}
//               disabled={saving}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={saving}>
//               {saving ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : null}
//               {mode === "create" ? "Create Role" : "Save Changes"}
//             </Button>
//           </div>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }

// src/features/roles/components/role-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Info, Lock, Loader2 } from "lucide-react";
import { createRole, updateRole } from "@/features/roles/api";
import type { RoleDetail } from "@/features/roles/types";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { useRoleUserCounts } from "@/hooks/useRoleUserCounts";
import { usePermissionModules } from "@/hooks/usePermissionModules";
import { PermissionMatrix } from "./PermissionMatrix";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionGate } from "@/components/PermissionGate";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  role?: RoleDetail | null;
  onUpdate?: () => Promise<void>;
};

// A role's stored permissions are already the real permission names
// (e.g. "manage_users", "VIEW_DASHBOARD", "publish_event") — no
// guessing/expanding needed, they map 1:1 to matrix checkbox ids.
function normalizeRolePermissions(role: RoleDetail): Set<string> {
  const perms = role.permissions as Array<string | { name: string }>;
  const set = new Set<string>();
  perms.forEach((p) => {
    const str = typeof p === "string" ? p : p?.name;
    if (str) set.add(str);
  });
  return set;
}

export function RoleSheet({ open, onOpenChange, mode, role, onUpdate }: Props) {
  const qc = useQueryClient();
  const {
    modules,
    actions,
    isLoading: isLoadingPerms,
  } = usePermissionModules();
  const { data: roleUserCounts, isLoading: isLoadingCounts } =
    useRoleUserCounts();

  const effectiveRole = role;
  const userCount = roleUserCounts?.get(effectiveRole?._id ?? "") ?? 0;
  const isSystemRole = effectiveRole?.is_system_role ?? false;

  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedPerms, setSelectedPerms] = React.useState<Set<string>>(
    new Set(),
  );
  const [originalPerms, setOriginalPerms] = React.useState<Set<string>>(
    new Set(),
  );
  const [nameError, setNameError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setNameError("");
      setEditing(false);
      return;
    }
    if (mode === "create") {
      setEditing(true);
      setName("");
      setDescription("");
      setSelectedPerms(new Set());
      setOriginalPerms(new Set());
    }
    if (mode === "view" && effectiveRole) {
      setEditing(false);
      setName(effectiveRole.name);
      setDescription(effectiveRole.description);
      const perms = normalizeRolePermissions(effectiveRole);
      setSelectedPerms(perms);
      setOriginalPerms(new Set(perms));
    }
  }, [open, mode, effectiveRole]);

  const createMut = useMutation({
    mutationFn: createRole,
    onSuccess: async () => {
      toast.success("Role created successfully.");
      qc.invalidateQueries({ queryKey: ["roles"] });
      await onUpdate?.();
      onOpenChange(false);
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Could not create role."),
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      original,
      updated,
    }: {
      id: string;
      original: Set<string>;
      updated: Set<string>;
    }) => {
      const permissions = Array.from(updated);
      return updateRole(id, { name, description, permissions });
    },
    onSuccess: async () => {
      toast.success("Role updated.");
      setName(name);
      setDescription(description);
      setEditing(false);
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Could not update role."),
  });

  // System roles: whatever they already had stays locked-in and gets
  // re-merged in defensively, even though the matrix already prevents
  // unchecking those boxes.
  const lockedPermissions = isSystemRole ? originalPerms : new Set<string>();

  const handleSubmit = () => {
    setNameError("");
    if (!name.trim()) {
      setNameError("Role name is required.");
      return;
    }
    if (selectedPerms.size === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    const finalPerms = isSystemRole
      ? new Set([...selectedPerms, ...originalPerms])
      : selectedPerms;
    const permissions = Array.from(finalPerms);

    if (mode === "create") {
      createMut.mutate({ name: name.trim(), description, permissions });
    } else if (effectiveRole) {
      const roleId = effectiveRole.id || effectiveRole._id;
      if (!roleId) {
        toast.error("Failed to update: Role ID is missing.");
        return;
      }
      updateMut.mutate({
        id: roleId,
        original: originalPerms,
        updated: finalPerms,
      });
    }
  };

  const saving = createMut.isPending || updateMut.isPending;
  // Fields (name/description) stay locked for system roles even while
  // adding permissions — only the permission matrix opens up for them.
  const fieldsReadOnly = mode === "view" && (isSystemRole || !editing);
  const permissionsReadOnly = mode === "view" && !editing;

  if (
    mode === "view" &&
    (isLoadingCounts || isLoadingPerms) &&
    !effectiveRole
  ) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </SheetHeader>
          <div className="space-y-6 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle>
                {mode === "create"
                  ? "Create Role"
                  : ((name || effectiveRole?.name) ?? "Role")}
              </SheetTitle>
              <SheetDescription>
                {mode === "create"
                  ? "Define a custom role with specific permissions."
                  : isSystemRole
                    ? "System roles cannot have existing permissions removed. You can add new permissions below."
                    : "Edit this role's permissions."}
              </SheetDescription>
            </div>
            {mode === "view" && effectiveRole && (
              <Badge
                variant={isSystemRole ? "secondary" : "outline"}
                className="shrink-0 mt-1"
              >
                {isSystemRole ? (
                  <>
                    <Lock className="h-3 w-3 mr-1" /> System
                  </>
                ) : (
                  "Custom"
                )}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Edit button — now available for system roles too */}
            {mode === "view" && (
              <div className="flex justify-end">
                <PermissionGate permission={PERMISSIONS.UPDATE_ROLE}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing
                      ? "Cancel editing"
                      : isSystemRole
                        ? "Add permissions"
                        : "Edit role"}
                  </Button>
                </PermissionGate>
              </div>
            )}

            {mode === "view" && isSystemRole && (
              <div className="flex items-start gap-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  System roles have fixed core permissions. You can{" "}
                  <strong>add new permissions</strong> below (checkboxes are
                  enabled for permissions not already assigned). Once added,
                  they cannot be removed.
                </span>
              </div>
            )}

            <section>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                General Information
              </label>
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Role Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    disabled={fieldsReadOnly}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    className={nameError ? "border-destructive" : ""}
                  />
                  {nameError && (
                    <p className="text-[10px] text-destructive">{nameError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Active Members
                  </label>
                  <div className="h-10 flex items-center px-3 rounded-md bg-muted/30 border border-dashed text-sm font-medium">
                    {isLoadingCounts ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `${userCount} user(s) assigned`
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Scope Description</label>
                <Input
                  disabled={fieldsReadOnly}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What can users with this role do?"
                />
              </div>
            </section>

            <Separator />

            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm font-medium">Permissions</p>
                  <p className="text-xs text-muted-foreground">
                    {permissionsReadOnly
                      ? `${selectedPerms.size} permissions granted.`
                      : "Select actions for each module."}
                  </p>
                </div>
                {!permissionsReadOnly && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedPerms.size} selected
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedPerms(new Set(lockedPermissions))
                      }
                      disabled={selectedPerms.size <= lockedPermissions.size}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              {isLoadingPerms ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <PermissionMatrix
                  selected={selectedPerms}
                  onChange={setSelectedPerms}
                  readOnly={permissionsReadOnly}
                  lockedPermissions={lockedPermissions}
                  modules={modules}
                  actions={actions}
                />
              )}
            </div>
          </div>
        </ScrollArea>

        {(mode === "create" || (mode === "view" && editing)) && (
          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                if (mode === "view") {
                  setEditing(false);
                  if (effectiveRole) {
                    setName(effectiveRole.name);
                    setDescription(effectiveRole.description);
                    setSelectedPerms(new Set(originalPerms));
                  }
                } else {
                  onOpenChange(false);
                }
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {mode === "create" ? "Create Role" : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
