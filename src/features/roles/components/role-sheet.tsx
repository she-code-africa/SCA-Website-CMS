"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Info, Lock, Search, X } from "lucide-react";

import { createRole, updateRole, getRoleById } from "@/features/roles/api";
import { getUsers } from "@/features/users/api"; 
import type { RoleDetail } from "@/features/roles/types";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { PermissionGate } from "@/components/PermissionGate";
import { useRoleUserCounts } from "@/hooks/useRoleUserCounts";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  role?: RoleDetail | null;
};

// ─── Constants & Dynamic Module Generators ───────────────────────────────────

const ACTION_COLUMNS = [
  "VIEW",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT"
] as const;

const ACTION_LABELS: Record<string, string> = {
  VIEW: "View",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  EXPORT: "Export"
};

// Groups the flat object by splitting string (e.g. "VIEW_TEAM" -> "TEAM")
const PERMISSION_MODULES = (() => {
  const map: Record<string, string[]> = {};

  Object.values(PERMISSIONS).forEach((perm) => {
    if (!perm.includes("_")) {
      if (!map["GENERAL"]) map["GENERAL"] = [];
      map["GENERAL"].push(perm);
      return;
    }

    const parts = perm.split("_");
    const moduleName = parts.slice(1).join(" ");

    if (!map[moduleName]) map[moduleName] = [];
    map[moduleName].push(perm);
  });

  return Object.entries(map).map(([key, perms]) => ({
    key: key.toUpperCase(),
    label: key.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    permissions: perms
  }));
})();

// ─── Memoized Checkbox Atom ──────────────────────────────────────────────────

const PermCheckbox = React.memo(function PermCheckbox({
  id,
  checked,
  disabled,
  onChange
}: {
  id: string;
  checked: boolean;
  disabled: boolean;
  onChange: (id: string, on: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(id, e.target.checked)}
        className={cn(
          "h-4 w-4 rounded border cursor-pointer",
          "accent-primary",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
    </div>
  );
});

// ─── Permission Matrix with Search ───────────────────────────────────────────

function PermissionMatrix({
  selected,
  onChange,
  readOnly
}: {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  readOnly: boolean;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredModules = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PERMISSION_MODULES;
    return PERMISSION_MODULES.filter(
      (m) =>
        m.label.toLowerCase().includes(q) || m.key.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Precompute column permissions dynamically mapping the API strings to save performance
  const columnPermsMap = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    ACTION_COLUMNS.forEach((action) => {
      map[action] = PERMISSION_MODULES.flatMap(({ permissions }) =>
        permissions.filter((p) => p.startsWith(action))
      );
    });
    return map;
  }, []);

  const toggle = React.useCallback(
    (perm: string, on: boolean) => {
      const next = new Set(selected);
      if (on) next.add(perm);
      else next.delete(perm);
      onChange(next);
    },
    [selected, onChange]
  );

  const toggleModule = (permissions: string[], on: boolean) => {
    const next = new Set(selected);
    permissions.forEach((p) => (on ? next.add(p) : next.delete(p)));
    onChange(next);
  };

  const toggleColumn = (action: string, on: boolean) => {
    const next = new Set(selected);
    const colPerms = columnPermsMap[action] || [];
    colPerms.forEach((p) => (on ? next.add(p) : next.delete(p)));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search modules (e.g. 'Team', 'Events')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 text-xs h-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto max-h-125 overflow-y-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 shadow-sm">
              <tr className="bg-muted/90 backdrop-blur-sm">
                <th className="py-2.5 px-3 text-left font-medium text-muted-foreground min-w-45 border-b">
                  Module
                </th>
                {ACTION_COLUMNS.map((action) => {
                  const colPerms = columnPermsMap[action] || [];
                  const allOn =
                    colPerms.length > 0 &&
                    colPerms.every((p) => selected.has(p));
                  const someOn = colPerms.some((p) => selected.has(p));

                  return (
                    <th
                      key={action}
                      className="py-2.5 px-2 text-center font-medium text-muted-foreground w-18 border-b"
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-xs uppercase tracking-wider">
                          {ACTION_LABELS[action]}
                        </span>
                        {colPerms.length > 0 && (
                          <input
                            type="checkbox"
                            checked={allOn}
                            disabled={readOnly}
                            ref={(el) => {
                              if (el) el.indeterminate = someOn && !allOn;
                            }}
                            onChange={(e) =>
                              toggleColumn(action, e.target.checked)
                            }
                            className={cn(
                              "h-3.5 w-3.5 accent-primary cursor-pointer",
                              readOnly && "cursor-not-allowed opacity-60"
                            )}
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y bg-background">
              {filteredModules.length > 0 ? (
                filteredModules.map(({ key, label, permissions }) => {
                  const moduleSelected = permissions.filter((p) =>
                    selected.has(p)
                  );
                  const allOn = moduleSelected.length === permissions.length;
                  const someOn = moduleSelected.length > 0;

                  return (
                    <tr
                      key={key}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 border-r">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={allOn}
                            disabled={readOnly}
                            ref={(el) => {
                              if (el) el.indeterminate = someOn && !allOn;
                            }}
                            onChange={(e) =>
                              toggleModule(permissions, e.target.checked)
                            }
                            className={cn(
                              "h-3.5 w-3.5 accent-primary cursor-pointer shrink-0",
                              readOnly && "cursor-not-allowed opacity-60"
                            )}
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {label}
                          </span>
                        </div>
                      </td>

                      {ACTION_COLUMNS.map((action) => {
                        const perm = permissions.find((p) =>
                          p.startsWith(action)
                        );
                        return (
                          <td key={action} className="py-2.5 px-2 text-center">
                            {perm ? (
                              <PermCheckbox
                                id={perm}
                                checked={selected.has(perm)}
                                disabled={readOnly}
                                onChange={toggle}
                              />
                            ) : (
                              <span className="text-muted-foreground/20 text-[10px]">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={ACTION_COLUMNS.length + 1}
                    className="py-12 text-center text-muted-foreground italic text-xs"
                  >
                    No modules found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Sheet ───────────────────────────────────────────────────────────────

export function RoleSheet({ open, onOpenChange, mode, role }: Props) {
  const qc = useQueryClient();

  // Fetch full role details when in view mode (to get usersCount)
const { data: roleUserCounts, isLoading: isLoadingCounts } =
  useRoleUserCounts();

  const effectiveRole =  role;

const userCount = roleUserCounts?.get(effectiveRole?._id ?? "") ?? 0;

  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedPerms, setSelectedPerms] = React.useState<Set<string>>(
    new Set()
  );
  const [nameError, setNameError] = React.useState("");

  // Use fetched role if available, otherwise fallback to passed role
  // const effectiveRole = fullRole || role;

  React.useEffect(() => {
    if (!open) {
      setNameError("");
      return;
    }
    if (mode === "create") {
      setEditing(true);
      setName("");
      setDescription("");
      setSelectedPerms(new Set());
    }
    if (mode === "view" && effectiveRole) {
      setEditing(false);
      setName(effectiveRole.name);
      setDescription(effectiveRole.description);

      const rawPerms = effectiveRole.permissions as Array<
        string | { name: string }
      >;
      const mappedPerms = new Set<string>();

      rawPerms.forEach((p) => {
        const str = typeof p === "string" ? p : p?.name;
        if (!str) return;

        const perm = str.trim();

        // 1. If it's already uppercase (Custom Roles), just add it
        if (
          perm === perm.toUpperCase() &&
          !perm.startsWith("read_") &&
          !perm.startsWith("manage_")
        ) {
          mappedPerms.add(perm);
          return;
        }

        // 2. Determine action and entity
        let action = "";
        let rawEntity = "";

        if (perm.startsWith("read_")) {
          action = "VIEW";
          rawEntity = perm.replace("read_", "");
        } else if (perm.startsWith("manage_")) {
          action = "MANAGE";
          rawEntity = perm.replace("manage_", "");
        }

        if (!action) return;

        // 3. Convert camelCase to SNAKE_CASE (e.g., talentRequests -> TALENT_REQUESTS)
        let entity = rawEntity.replace(/([A-Z])/g, "_$1").toUpperCase();

        // 4. Normalize plurals and specific edge cases to match your constants
        const pluralMappings: Record<string, string> = {
          USERS: "USER",
          PROGRAMS: "PROGRAM",
          EVENTS: "EVENT",
          JOBS: "JOB",
          CHAPTERS: "CHAPTER",
          COMPANIES: "COMPANY",
          SCHOOLS: "SCHOOL",
          COURSES: "COURSE",
          PARTNERS: "PARTNER",
          ENQUIRIES: "ENQUIRY",
          TEAMS: "TEAM",
          VOLUNTEER_REQUESTS: "VOLUNTEER_REQUEST",
          TALENT_REQUESTS: "TALENT_REQUEST",
          TESTIMONIALS: "TESTIMONIALS",
          SUCCESS_STORIES: "SUCCESS_STORY",
          OUR_REACH: "OUR_REACH"
        };

        if (pluralMappings[entity]) {
          entity = pluralMappings[entity];
        }

        // 5. Hydrate the permission set
        if (action === "VIEW") {
          mappedPerms.add(`VIEW_${entity}`);
        } else if (action === "MANAGE") {
          mappedPerms.add(`VIEW_${entity}`);
          mappedPerms.add(`CREATE_${entity}`);
          mappedPerms.add(`UPDATE_${entity}`);
          mappedPerms.add(`DELETE_${entity}`);
        }
      });

      setSelectedPerms(mappedPerms);
    }
  }, [open, mode, effectiveRole]);

  const createMut = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Role created successfully.");
      qc.invalidateQueries({ queryKey: ["roles"] });
      onOpenChange(false);
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Could not create role.")
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      name: string;
      description: string;
      permissions: string[];
    }) => updateRole(id, input),
    onSuccess: () => {
      toast.success("Role updated.");
      qc.invalidateQueries({ queryKey: ["roles"] });
      setEditing(false);
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Could not update role.")
  });

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

    const permissions = Array.from(selectedPerms);

    if (mode === "create") {
      createMut.mutate({ name, description, permissions });
    } else if (effectiveRole) {
      const roleId = effectiveRole.id || effectiveRole._id;

      if (!roleId) {
        toast.error("Failed to update: Role ID is missing.");
        return;
      }

      updateMut.mutate({ id: roleId, name, description, permissions });
    }
  };

  const saving = createMut.isPending || updateMut.isPending;
  const isReadOnly =
    mode === "view" && (effectiveRole?.is_system_role || !editing);
  const canEdit = mode === "view" && !effectiveRole?.is_system_role;

  // Skeleton loader while fetching role details
  if (mode === "view" && isLoadingCounts && !effectiveRole) {
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
          <div className="flex-1 px-6 py-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
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
            <div className="min-w-0">
              <SheetTitle>
                {mode === "create"
                  ? "Create Role"
                  : (effectiveRole?.name ?? "Role")}
              </SheetTitle>
              <SheetDescription>
                {mode === "create"
                  ? "Define a custom role with specific permissions."
                  : effectiveRole?.is_system_role
                    ? "System roles cannot be edited or deleted."
                    : "Edit this role's name and permissions."}
              </SheetDescription>
            </div>
            {mode === "view" && effectiveRole && (
              <Badge
                variant={effectiveRole.is_system_role ? "secondary" : "outline"}
                className="shrink-0 mt-1"
              >
                {effectiveRole.is_system_role ? (
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
            {mode === "view" && canEdit && (
              <div className="flex items-center justify-end">
                <PermissionGate permission={PERMISSIONS.UPDATE_ROLE}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (editing) {
                        if (effectiveRole) {
                          setName(effectiveRole.name);
                          setDescription(effectiveRole.description);
                          const rawPerms = effectiveRole.permissions as Array<
                            string | { name: string }
                          >;
                          const permissionStrings = rawPerms
                            .map((p) => {
                              if (typeof p === "string") return p;
                              if (p && typeof p === "object" && "name" in p)
                                return p.name;
                              return "";
                            })
                            .filter(Boolean);
                          setSelectedPerms(new Set(permissionStrings));
                        }
                      }
                      setEditing((v) => !v);
                    }}
                  >
                    {editing ? "Cancel editing" : "Edit role"}
                  </Button>
                </PermissionGate>
              </div>
            )}

            {mode === "view" && effectiveRole?.is_system_role && (
              <div className="flex items-start gap-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  System roles are managed by SheCode Africa and cannot be
                  modified or deleted.
                </span>
              </div>
            )}

            <section className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  General Information
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Role Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      disabled={isReadOnly}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError("");
                      }}
                      className={nameError ? "border-destructive" : ""}
                    />
                    {nameError && (
                      <p className="text-[10px] text-destructive font-medium uppercase tracking-tighter">
                        {nameError}
                      </p>
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
                        `${userCount ?? 0} user(s) assigned`
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Scope Description
                  </label>
                  <Input
                    disabled={isReadOnly}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What can users with this role do?"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Permissions</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isReadOnly
                        ? `${selectedPerms.size} permissions granted.`
                        : "Select actions for each module."}
                    </p>
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {selectedPerms.size} selected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setSelectedPerms(new Set())}
                        disabled={selectedPerms.size === 0}
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>

                <PermissionMatrix
                  selected={selectedPerms}
                  onChange={setSelectedPerms}
                  readOnly={isReadOnly}
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        {(mode === "create" || (mode === "view" && editing)) && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                if (mode === "view" && effectiveRole) {
                  setEditing(false);
                  setName(effectiveRole.name);
                  setDescription(effectiveRole.description);
                  const rawPerms = effectiveRole.permissions as Array<
                    string | { name: string }
                  >;
                  const permissionStrings = rawPerms
                    .map((p) => {
                      if (typeof p === "string") return p;
                      if (p && typeof p === "object" && "name" in p)
                        return p.name;
                      return "";
                    })
                    .filter(Boolean);
                  setSelectedPerms(new Set(permissionStrings));
                } else {
                  onOpenChange(false);
                }
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Create Role"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
