"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Info, Lock } from "lucide-react";

import { createRole, updateRole } from "@/features/roles/api";
import type { RoleDetail } from "@/features/roles/types";
import {
  PERMISSION_MODULES,
  ACTION_COLUMNS,
  ACTION_LABELS
} from "@/features/roles/mock";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  role?: RoleDetail | null;
};

// ─── Checkbox atom ───────────────────────────────────────────────────────────

function PermCheckbox({
  checked,
  disabled,
  onChange
}: {
  checked: boolean;
  disabled: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className={cn(
          "h-4 w-4 rounded border cursor-pointer",
          "accent-primary",
          disabled && "cursor-not-allowed opacity-60"
        )}
      />
    </div>
  );
}

// ─── Permission Matrix ────────────────────────────────────────────────────────

function PermissionMatrix({
  selected,
  onChange,
  readOnly
}: {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  readOnly: boolean;
}) {
  const toggle = (perm: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(perm);
    else next.delete(perm);
    onChange(next);
  };

  // Select/deselect all in a module
  const toggleModule = (permissions: string[], on: boolean) => {
    const next = new Set(selected);
    permissions.forEach((p) => (on ? next.add(p) : next.delete(p)));
    onChange(next);
  };

  // Select/deselect entire action column
  const toggleColumn = (action: string, on: boolean) => {
    const next = new Set(selected);
    PERMISSION_MODULES.forEach(({ permissions }) => {
      permissions
        .filter((p) => p.startsWith(action + "_"))
        .forEach((p) => (on ? next.add(p) : next.delete(p)));
    });
    onChange(next);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Column headers */}
          <thead>
            <tr className="bg-muted/60 border-b">
              <th className="py-2.5 px-3 text-left font-medium text-muted-foreground min-w-45">
                Module
              </th>
              {ACTION_COLUMNS.map((action) => {
                // Determine if entire column is selected
                const colPerms = PERMISSION_MODULES.flatMap(({ permissions }) =>
                  permissions.filter((p) => p.startsWith(action + "_"))
                );
                const allOn =
                  colPerms.length > 0 && colPerms.every((p) => selected.has(p));
                const someOn = colPerms.some((p) => selected.has(p));

                return (
                  <th
                    key={action}
                    className="py-2.5 px-2 text-center font-medium text-muted-foreground w-18"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs">{ACTION_LABELS[action]}</span>
                      {!readOnly && colPerms.length > 0 && (
                        <input
                          type="checkbox"
                          title={`Toggle all ${ACTION_LABELS[action]}`}
                          checked={allOn}
                          ref={(el) => {
                            if (el) el.indeterminate = someOn && !allOn;
                          }}
                          onChange={(e) =>
                            toggleColumn(action, e.target.checked)
                          }
                          className="h-3.5 w-3.5 accent-primary cursor-pointer"
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y">
            {PERMISSION_MODULES.map(({ key, label, permissions }) => {
              const moduleSelected = permissions.filter((p) => selected.has(p));
              const allOn = moduleSelected.length === permissions.length;
              const someOn = moduleSelected.length > 0;

              return (
                <tr key={key} className="hover:bg-muted/30 transition-colors">
                  {/* Module name + select-all row checkbox */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      {!readOnly && (
                        <input
                          type="checkbox"
                          title={`Toggle all in ${label}`}
                          checked={allOn}
                          ref={(el) => {
                            if (el) el.indeterminate = someOn && !allOn;
                          }}
                          onChange={(e) =>
                            toggleModule(permissions, e.target.checked)
                          }
                          className="h-3.5 w-3.5 accent-primary cursor-pointer shrink-0"
                        />
                      )}
                      <span className="text-xs font-medium leading-tight">
                        {label}
                      </span>
                    </div>
                  </td>

                  {/* Action cells */}
                  {ACTION_COLUMNS.map((action) => {
                    const perm = permissions.find((p) =>
                      p.startsWith(action + "_")
                    );
                    return (
                      <td key={action} className="py-2.5 px-2 text-center">
                        {perm ? (
                          <PermCheckbox
                            checked={selected.has(perm)}
                            disabled={readOnly}
                            onChange={(v) => toggle(perm, v)}
                          />
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Sheet ───────────────────────────────────────────────────────────────

export function RoleSheet({ open, onOpenChange, mode, role }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedPerms, setSelectedPerms] = React.useState<Set<string>>(
    new Set()
  );
  const [nameError, setNameError] = React.useState("");

  // Reset / populate when sheet opens
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
    if (mode === "view" && role) {
      setEditing(false);
      setName(role.name);
      setDescription(role.description);
      setSelectedPerms(new Set(role.permissions));
    }
  }, [open, mode, role]);

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
    } else if (role) {
      updateMut.mutate({ id: role.id, name, description, permissions });
    }
  };

  const saving = createMut.isPending || updateMut.isPending;
  const isReadOnly = mode === "view" && (role?.isDefault || !editing);
  const canEdit = mode === "view" && !role?.isDefault;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b space-y-1 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <SheetTitle>
                {mode === "create" ? "Create Role" : (role?.name ?? "Role")}
              </SheetTitle>
              <SheetDescription>
                {mode === "create"
                  ? "Define a custom role with specific permissions."
                  : role?.isDefault
                    ? "System roles cannot be edited or deleted."
                    : "Edit this role's name and permissions."}
              </SheetDescription>
            </div>
            {mode === "view" && role && (
              <Badge
                variant={role.isDefault ? "secondary" : "outline"}
                className="shrink-0 mt-1"
              >
                {role.isDefault ? (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    System
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
            {/* Edit / view toggle row for non-default roles */}
            {mode === "view" && canEdit && (
              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editing) {
                      // cancel — reset to saved
                      setName(role!.name);
                      setDescription(role!.description);
                      setSelectedPerms(new Set(role!.permissions));
                    }
                    setEditing((v) => !v);
                  }}
                >
                  {editing ? "Cancel editing" : "Edit role"}
                </Button>
              </div>
            )}

            {/* System role read-only notice */}
            {mode === "view" && role?.isDefault && (
              <div className="flex items-start gap-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  System roles are managed by SheCode Africa and cannot be
                  modified or deleted. You can view the permissions below.
                </span>
              </div>
            )}

            {/* Name & description */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Role name{" "}
                  {!isReadOnly && <span className="text-destructive">*</span>}
                </label>
                {isReadOnly ? (
                  <p className="text-sm py-2">{name || "—"}</p>
                ) : (
                  <>
                    <Input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      placeholder="e.g. Content Editor"
                      className={nameError ? "border-destructive" : ""}
                    />
                    {nameError && (
                      <p className="text-xs text-destructive">{nameError}</p>
                    )}
                  </>
                )}
              </div>

              {mode === "view" && role && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Users assigned
                  </label>
                  <p className="text-sm py-2">
                    {role.usersCount} user{role.usersCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              {isReadOnly ? (
                <p className="text-sm text-muted-foreground py-1">
                  {description || "No description."}
                </p>
              ) : (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this role is for…"
                  rows={2}
                />
              )}
            </div>

            <Separator />

            {/* Permissions section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">Permissions</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isReadOnly
                      ? `${selectedPerms.size} permissions granted to this role.`
                      : "Select which actions this role can perform on each module."}
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
          </div>
        </ScrollArea>

        {/* Footer */}
        {(mode === "create" || (mode === "view" && editing)) && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                if (mode === "view") {
                  setEditing(false);
                  setName(role!.name);
                  setDescription(role!.description);
                  setSelectedPerms(new Set(role!.permissions));
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
