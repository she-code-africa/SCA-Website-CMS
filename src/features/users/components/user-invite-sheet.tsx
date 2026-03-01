"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

import { inviteUser, updateUser } from "@/features/users/api";
import type { AdminUser } from "@/features/users/types";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Role = { id: string; name: string; isDefault: boolean };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "invite" | "view";
  user?: AdminUser | null;
  roles: Role[];
};

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy 'at' HH:mm");
}

function initials(user: AdminUser) {
  const a = user.firstName?.[0] ?? "";
  const b = user.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" }
};

export function UserSheet({ open, onOpenChange, mode, user, roles }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);

  // ── Invite form state ──────────────────────────────────────────
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRoleId, setInviteRoleId] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  // ── Edit form state ────────────────────────────────────────────
  const [editRoleId, setEditRoleId] = React.useState("");

  // Reset state when sheet opens/closes or mode changes
  React.useEffect(() => {
    if (!open) {
      setInviteEmail("");
      setInviteRoleId("");
      setEmailError("");
      setEditing(false);
      return;
    }
    if (mode === "invite") {
      setEditing(true);
    }
    if (mode === "view" && user) {
      setEditing(false);
      setEditRoleId(user.role.id);
    }
  }, [open, mode, user]);

  // ── Invite mutation ────────────────────────────────────────────
  const inviteMut = useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      toast.success("Invitation sent successfully.");
      qc.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not send invitation.")
  });

  // ── Update mutation ────────────────────────────────────────────
  const updateMut = useMutation({
    mutationFn: ({ id, roleId }: { id: string; roleId: string }) =>
      updateUser(id, { roleId }),
    onSuccess: () => {
      toast.success("User updated.");
      qc.invalidateQueries({ queryKey: ["users"] });
      setEditing(false);
    },
    onError: () => toast.error("Could not update user.")
  });

  // ── Invite submit ──────────────────────────────────────────────
  const handleInviteSubmit = () => {
    setEmailError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inviteEmail.trim()) {
      setEmailError("Email is required.");
      return;
    }
    if (!emailRegex.test(inviteEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!inviteRoleId) {
      toast.error("Please select a role before sending the invite.");
      return;
    }
    inviteMut.mutate({ email: inviteEmail.trim(), roleId: inviteRoleId });
  };

  // ── Edit submit ────────────────────────────────────────────────
  const handleEditSubmit = () => {
    if (!user) return;
    updateMut.mutate({ id: user.id, roleId: editRoleId });
  };

  const saving = inviteMut.isPending || updateMut.isPending;
  const fullName =
    mode === "view" && user
      ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
      : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "invite" ? "Invite User" : fullName}
          </SheetTitle>
          <SheetDescription>
            {mode === "invite"
              ? "Send an invitation email with a role pre-assigned."
              : "View and manage this user's role and access."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* ── INVITE MODE ──────────────────────────────────── */}
            {mode === "invite" && (
              <div className="space-y-5">
                <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  The invited user will receive an email with a link to set up
                  their password. The link expires after{" "}
                  <strong className="text-foreground">48 hours</strong>.
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="user@shecodeafrica.org"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={emailError ? "border-destructive" : ""}
                  />
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Assign role <span className="text-destructive">*</span>
                  </label>
                  <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The user&apos;s permissions will be determined by the role
                    assigned.
                  </p>
                </div>
              </div>
            )}

            {/* ── VIEW / EDIT MODE ─────────────────────────────── */}
            {mode === "view" && user && (
              <div className="space-y-6">
                {/* Profile header */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold text-primary">
                    {initials(user)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-base truncate">
                      {fullName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <div className="mt-1.5">
                      <Badge
                        variant={
                          statusConfig[user.status]?.variant ?? "outline"
                        }
                      >
                        {statusConfig[user.status]?.label ?? user.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">Last login</p>
                      <p className="font-medium">{fmtDate(user.lastLogin)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">{fmtDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Role assignment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Role & Access</p>
                    {!editing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        Change role
                      </Button>
                    )}
                  </div>

                  {editing ? (
                    <div className="space-y-2">
                      <Select value={editRoleId} onValueChange={setEditRoleId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Changing a role takes effect immediately — the user&apos;s
                        permissions will update on their next page load.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm py-1 px-3">
                        {user.role.name}
                      </Badge>
                      {user.role.isDefault && (
                        <span className="text-xs text-muted-foreground">
                          (System role)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer action bar */}
        <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
          <Button
            variant="outline"
            onClick={() => {
              if (editing && mode === "view") {
                setEditing(false);
                if (user) setEditRoleId(user.role.id);
              } else {
                onOpenChange(false);
              }
            }}
            disabled={saving}
          >
            {editing && mode === "view" ? "Cancel" : "Close"}
          </Button>

          {mode === "invite" && (
            <Button onClick={handleInviteSubmit} disabled={saving}>
              {saving ? "Sending…" : "Send Invitation"}
            </Button>
          )}

          {mode === "view" && editing && (
            <Button onClick={handleEditSubmit} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
