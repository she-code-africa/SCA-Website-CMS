"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TalentRequest, TalentRequestStatus } from "../types";
import {
  createTalentRequest,
  updateTalentRequest,
  updateTalentRequestStatus,
  deleteTalentRequest
} from "../api";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: TalentRequest | null;
  onUpdate?: () => void;
  onDelete?: () => void;
};

function badgeVariant(status?: TalentRequestStatus) {
  if (status === "Open") return "default";
  if (status === "Closed") return "destructive";
  if (status === "Archived") return "secondary";
  return "secondary"; // Pending
}

type FormData = {
  fullname: string;
  email: string;
  experienceLevel: string;
  jobRole: string;
  company: string;
  companyLink: string;
  jobDescription: string;
  status: TalentRequestStatus;
};

export function TalentRequestDetailsSheet({
  open,
  onOpenChange,
  row,
  onUpdate,
  onDelete
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [form, setForm] = React.useState<FormData>({
    fullname: "",
    email: "",
    experienceLevel: "",
    jobRole: "",
    company: "",
    companyLink: "",
    jobDescription: "",
    status: "Pending"
  });

  const isCreate = !row;

  React.useEffect(() => {
    if (!open) {
      setEditing(false);
      setShowDeleteConfirm(false);
      return;
    }
    if (isCreate) {
      setEditing(true);
      setForm({
        fullname: "",
        email: "",
        experienceLevel: "",
        jobRole: "",
        company: "",
        companyLink: "",
        jobDescription: "",
        status: "Pending"
      });
    } else if (row) {
      setEditing(false);
      setForm({
        fullname: row.fullname ?? "",
        email: row.email ?? "",
        experienceLevel: row.experienceLevel ?? "",
        jobRole: row.jobRole ?? "",
        company: row.company ?? "",
        companyLink: row.companyLink ?? "",
        jobDescription: row.jobDescription ?? "",
        status: row.status ?? "Pending"
      });
    }
  }, [open, row, isCreate]);

  const createMutation = useMutation({
    mutationFn: (data: Omit<FormData, "status">) => createTalentRequest(data),
    onSuccess: () => {
      toast.success("Talent request created");
      qc.invalidateQueries({ queryKey: ["talent-requests"] });
      onOpenChange(false);
      onUpdate?.();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to create request")
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
      previousStatus
    }: {
      id: string;
      data: Partial<FormData>;
      previousStatus?: TalentRequestStatus;
    }) => {
      const { status, ...otherFields } = data;
      // Update non-status fields via PUT
      if (Object.keys(otherFields).length > 0) {
        await updateTalentRequest(id, otherFields);
      }
      // Update status via PATCH if changed
      if (status && previousStatus && status !== previousStatus) {
        await updateTalentRequestStatus({ id, status });
      }
    },
    onSuccess: () => {
      toast.success("Request updated");
      qc.invalidateQueries({ queryKey: ["talent-requests"] });
      setEditing(false);
      onUpdate?.();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update request")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTalentRequest(id),
    onSuccess: () => {
      toast.success("Request deleted");
      qc.invalidateQueries({ queryKey: ["talent-requests"] });
      onOpenChange(false);
      onDelete?.();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete request")
  });

  const handleSubmit = () => {
    if (isCreate) {
      const { status, ...createData } = form;
      createMutation.mutate(createData);
    } else if (row) {
      const { status, ...otherFields } = form;
      updateMutation.mutate({
        id: row._id,
        data: { ...otherFields, status },
        previousStatus: row.status
      });
    }
  };

  const saving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  if (!isCreate && !row && open) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
            <div className="space-y-3 mt-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
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
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {isCreate
              ? "Add Talent Request"
              : (row?.fullname ?? "Talent Request Details")}
          </SheetTitle>
          <SheetDescription>
            {isCreate
              ? "Create a new talent request manually."
              : editing
                ? "Update the request status and details."
                : "View request details and change status."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {!isCreate && !editing && row && (
              <div className="flex justify-end gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_TALENT_REQUEST}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                </PermissionGate>
                <PermissionGate permission={PERMISSIONS.DELETE_TALENT_REQUEST}>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </Button>
                </PermissionGate>
              </div>
            )}

            {!editing && !isCreate && row && (
              <div className="flex items-center justify-between">
                <Badge variant={badgeVariant(form.status)}>
                  {form.status ?? "Pending"}
                </Badge>
              </div>
            )}

            <div className="grid gap-4">
              <Field
                label="Full Name"
                value={form.fullname}
                onChange={(v) => setForm({ ...form, fullname: v })}
                disabled={!editing && !isCreate}
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                disabled={!editing && !isCreate}
                required
              />
              <Field
                label="Experience Level"
                value={form.experienceLevel}
                onChange={(v) => setForm({ ...form, experienceLevel: v })}
                disabled={!editing && !isCreate}
              />
              <Field
                label="Job Role"
                value={form.jobRole}
                onChange={(v) => setForm({ ...form, jobRole: v })}
                disabled={!editing && !isCreate}
              />
              <Field
                label="Company"
                value={form.company}
                onChange={(v) => setForm({ ...form, company: v })}
                disabled={!editing && !isCreate}
              />
              <Field
                label="Company Link"
                value={form.companyLink}
                onChange={(v) => setForm({ ...form, companyLink: v })}
                disabled={!editing && !isCreate}
              />
              <div className="grid gap-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  value={form.jobDescription}
                  onChange={(e) =>
                    setForm({ ...form, jobDescription: e.target.value })
                  }
                  disabled={!editing && !isCreate}
                  rows={6}
                  placeholder="Describe the role..."
                />
              </div>

              {!isCreate && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as TalentRequestStatus })
                    }
                    disabled={!editing && !isCreate}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {(isCreate || editing) && (
          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                if (editing && !isCreate) setEditing(false);
                else onOpenChange(false);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isCreate ? "Create" : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete talent request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => row && deleteMutation.mutate(row._id)}
              disabled={saving}
              className="bg-destructive hover:bg-destructive/90"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  required = false,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
