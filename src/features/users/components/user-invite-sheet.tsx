"use client";

import * as React from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { PermissionGate } from "@/components/PermissionGate";
import type { AdminUser, UserRole } from "@/features/users/types";

function fmtDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy 'at' HH:mm");
}

function initials(user: AdminUser) {
  const a = user.firstName?.[0] ?? "";
  const b = user.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

function getRoleName(user: AdminUser, roles: UserRole[]): string {
  const roleValue = user.role;
  if (!roleValue) return "User";
  if (typeof roleValue === "object") return roleValue.name || "User";
  if (roleValue === "ADMINISTRATOR") return "Super Admin";
  const matched = roles.find((r) => r._id === roleValue);
  return matched?.name || roleValue;
}

function getRoleId(user: AdminUser): string {
  const roleValue = user.role;
  if (!roleValue) return "";
  if (typeof roleValue === "string") return roleValue;
  return roleValue._id;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "invite" | "view";
  user?: AdminUser | null;
  roles: UserRole[];
  isSaving?: boolean;
  onInvite?: (email: string, roleId: string) => Promise<void>;
  onRoleUpdate?: (userId: string, newRoleId: string) => Promise<void>;
  onToggleStatus?: (user: AdminUser) => Promise<void> | void;
  onDelete?: (user: AdminUser) => Promise<void> | void;
  onDeleteExpiredInvite?: (user: AdminUser) => Promise<void> | void;
  onUpdateUser?: (updatedUser: AdminUser) => void;
};

export function UserSheet({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  isSaving = false,
  onInvite,
  onRoleUpdate,
  onToggleStatus,
  onDelete,
  onDeleteExpiredInvite,
  onUpdateUser
}: Props) {
  // Local UI state
  const [editing, setEditing] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showExpiredDeleteConfirm, setShowExpiredDeleteConfirm] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRoleId, setInviteRoleId] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [editRoleId, setEditRoleId] = React.useState("");
  const [localSaving, setLocalSaving] = React.useState(false);
  const [statusToggling, setStatusToggling] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [isExpired, setIsExpired] = React.useState(false);
  const isPending = user?.status === "pending";

  React.useEffect(() => {
    queueMicrotask(() => {
      if (!isPending || !user?.expiresAt) {
        setIsExpired(false);
        return;
      }
      setIsExpired(Date.now() > new Date(user.expiresAt).getTime());
    });
  }, [user, isPending]);

  // Reset state when sheet opens/closes
  React.useEffect(() => {
    if (!open) {
      queueMicrotask(() => {
        setInviteEmail("");
        setInviteRoleId("");
        setEmailError("");
        setEditing(false);
        setShowConfirm(false);
        setShowDeleteConfirm(false);
        setShowExpiredDeleteConfirm(false); 
        setLocalSaving(false);
        setStatusToggling(false);
        setDeleting(false);
      });
      return;
    }

    queueMicrotask(() => {
      if (mode === "invite") {
        setEditing(true);
      }
      if (mode === "view" && user) {
        setEditing(false);
        setEditRoleId(getRoleId(user));
      }
    });
  }, [open, mode, user]);

  const fullName =
    mode === "view" && user
      ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
      : "";

  const selectedRoleName = roles.find((r) => r._id === editRoleId)?.name;

  const handleInviteSubmit = async () => {
    setEmailError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inviteEmail.trim() || !emailRegex.test(inviteEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!inviteRoleId) {
      setEmailError("Please select a role.");
      return;
    }
    if (!onInvite) return;

    setLocalSaving(true);
    try {
      await onInvite(inviteEmail.trim(), inviteRoleId);
      onOpenChange(false);
    } catch (error) {
      setEmailError("Failed to send invitation.");
    } finally {
      setLocalSaving(false);
    }
  };

  const handleEditSubmit = () => {
    if (!user) return;
    if (editRoleId !== getRoleId(user)) {
      setShowConfirm(true);
    } else {
      setEditing(false);
    }
  };

  const confirmRoleChange = async () => {
    if (!user || !onRoleUpdate) return;
    const userId = user._id;
    if (!userId) return;

    setLocalSaving(true);
    try {
      await onRoleUpdate(userId, editRoleId);
      if (onUpdateUser) {
        const newRoleObj = roles.find((r) => r._id === editRoleId);
        onUpdateUser({ ...user, role: newRoleObj || editRoleId });
      }
      setEditing(false);
      setShowConfirm(false);
    } catch (error) {
      // handled in parent
    } finally {
      setLocalSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user || !onToggleStatus) return;
    setStatusToggling(true);
    try {
      await onToggleStatus(user);
      if (onUpdateUser) {
        onUpdateUser({ ...user, isActive: !user.isActive });
      }
    } finally {
      setStatusToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(user);
      onOpenChange(false);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteExpiredInviteConfirm = async () => {
    if (!user || !onDeleteExpiredInvite) return;
    setDeleting(true);
    try {
      await onDeleteExpiredInvite(user);
      onOpenChange(false);
    } finally {
      setDeleting(false);
      setShowExpiredDeleteConfirm(false);
    }
  };

  const saving = isSaving || localSaving || statusToggling || deleting;

  const getStatusBadge = (u: AdminUser) => {
    if (u.status === "pending") {
      return <Badge variant="outline">Pending</Badge>;
    }
    const isActive = u.isActive ?? u.status === "active";
    return (
      <Badge variant={isActive ? "default" : "destructive"}>
        {isActive ? "Active" : "Deactivated"}
      </Badge>
    );
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 flex flex-col"
        >
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
              {mode === "invite" && (
                <div className="space-y-5">
                  <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    The invited user will receive an email to set up their
                    account. The link expires after <strong>24 hours</strong>.
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email address</label>
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
                    <label className="text-sm font-medium">Assign role</label>
                    <Select
                      value={inviteRoleId}
                      onValueChange={setInviteRoleId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r._id} value={r._id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {mode === "view" && user && (
                <div className="space-y-6">
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
                      <div className="mt-1.5">{getStatusBadge(user)}</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">{fmtDate(user.createdAt)}</p>
                    </div>
                  </div>
                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Role & Access</p>
                      {!editing && !isPending && (
                        <PermissionGate permission={PERMISSIONS.UPDATE_USER}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(true)}
                            disabled={saving}
                          >
                            Change role
                          </Button>
                        </PermissionGate>
                      )}
                    </div>

                    {editing ? (
                      <div className="space-y-2">
                        <Select
                          value={editRoleId}
                          onValueChange={setEditRoleId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r._id} value={r._id}>
                                {r.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground italic">
                          * Changes to user permissions take effect immediately.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-sm py-1 px-3"
                        >
                          {getRoleName(user, roles)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {isPending ? (
                      // ── PENDING INVITE UI ──
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isExpired ? "destructive" : "outline"}
                          >
                            {isExpired ? "Expired" : "Pending"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {isExpired
                              ? "Invite has expired. Please delete it."
                              : "User has not accepted the invite yet."}
                          </span>
                        </div>

                        {/* Show "Delete Expired Invite" button ONLY if expired */}
                        {isExpired && (
                          <PermissionGate permission={PERMISSIONS.DELETE_USER}>
                            <Button
                              variant="destructive"
                              onClick={() => setShowExpiredDeleteConfirm(true)}
                              disabled={saving}
                            >
                              Delete Expired Invite
                            </Button>
                          </PermissionGate>
                        )}
                      </div>
                    ) : (
                      // ── ACTIVE / DEACTIVATED USER UI ──
                      <>
                        <PermissionGate permission={PERMISSIONS.UPDATE_USER}>
                          <Button
                            variant="outline"
                            onClick={handleToggleStatus}
                            disabled={saving}
                            className={
                              user.isActive
                                ? "text-amber-500"
                                : "text-emerald-500"
                            }
                          >
                            {statusToggling ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {user.isActive
                                  ? "Deactivating..."
                                  : "Activating..."}
                              </>
                            ) : user.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </Button>
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.DELETE_USER}>
                          <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={saving}
                          >
                            Delete User
                          </Button>
                        </PermissionGate>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                if (editing && mode === "view") {
                  setEditing(false);
                  if (user) setEditRoleId(getRoleId(user));
                } else {
                  onOpenChange(false);
                }
              }}
              disabled={saving}
            >
              {editing && mode === "view" ? "Cancel" : "Close"}
            </Button>

            {mode === "invite" && (
              <Button
                onClick={handleInviteSubmit}
                disabled={saving || !inviteEmail || !inviteRoleId}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
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

      {/* Role Change Confirmation */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change <strong>{fullName}&apos;s</strong>{" "}
              role to <strong>{selectedRoleName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} disabled={saving}>
              {saving ? "Updating..." : "Confirm Change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog for Expired Invite Confirmation */}
      <AlertDialog open={showExpiredDeleteConfirm} onOpenChange={setShowExpiredDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expired Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the expired invitation for <strong>{user?.email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpiredInviteConfirm}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}