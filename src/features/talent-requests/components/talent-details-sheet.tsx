  // src/features/talent-requests/components/talent-details-sheet.tsx
  "use client";

  import * as React from "react";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";
  import type { TalentRequest, TalentRequestStatus } from "../types";
  import {
    getTalentRequest,
    createTalentRequest,
    updateTalentRequest,
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
    AlertDialogTitle,
    // AlertDialogTrigger
  } from "@/components/ui/alert-dialog";
  import { Loader2 } from "lucide-react";

  type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    row: TalentRequest | null;
    onUpdate?: () => void; // refetch list after update
    onDelete?: () => void; // refetch after delete
  };

  function badgeVariant(status?: string) {
    if (status === "Approved") return "default";
    if (status === "Rejected") return "destructive";
    return "secondary";
  }

  // Form fields for create/edit
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

    // If row is null, it's create mode
    const isCreate = !row;

    // Fetch full data when editing an existing request (optional)
    const { data: fullRequest } = useQuery({
      queryKey: ["talent-request", row?._id],
      queryFn: () => getTalentRequest(row!._id),
      enabled: open && !!row && !isCreate,
      staleTime: 0
    });

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
      } else if (fullRequest) {
        setEditing(false);
        setForm({
          fullname: fullRequest.fullname ?? "",
          email: fullRequest.email ?? "",
          experienceLevel: fullRequest.experienceLevel ?? "",
          jobRole: fullRequest.jobRole ?? "",
          company: fullRequest.company ?? "",
          companyLink: fullRequest.companyLink ?? "",
          jobDescription: fullRequest.jobDescription ?? "",
          status: fullRequest.status ?? "Pending"
        });
      } else if (row && !fullRequest) {
        // Use passed row if query not enabled (fallback)
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
    }, [open, row, fullRequest, isCreate]);

    const createMutation = useMutation({
      mutationFn: (data: Omit<FormData, "status">) => createTalentRequest(data),
      onSuccess: () => {
        toast.success("Talent request created");
        qc.invalidateQueries({ queryKey: ["talent-requests"] });
        onOpenChange(false);
        onUpdate?.();
      },
      onError: () => toast.error("Failed to create request")
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<FormData> }) =>
        updateTalentRequest(id, data),
      onSuccess: () => {
        toast.success("Request updated");
        qc.invalidateQueries({ queryKey: ["talent-requests"] });
        qc.invalidateQueries({ queryKey: ["talent-request", row?._id] });
        setEditing(false);
        onUpdate?.();
      },
      onError: () => toast.error("Failed to update request")
    });

    const deleteMutation = useMutation({
      mutationFn: (id: string) => deleteTalentRequest(id),
      onSuccess: () => {
        toast.success("Request deleted");
        qc.invalidateQueries({ queryKey: ["talent-requests"] });
        onOpenChange(false);
        onDelete?.();
      },
      onError: () => toast.error("Failed to delete request")
    });

    // In handleSubmit, when updating, send the full form data (or just status? adjust as needed)
    const handleSubmit = () => {
      if (isCreate) {
        const { status, ...createData } = form;
        createMutation.mutate(createData);
      } else if (row) {
        // For update, you can send the whole form or only changed fields.
        // Here we send the whole form (excluding read-only fields if any)
        const { ...updateData } = form;
        updateMutation.mutate({ id: row._id, data: updateData });
      }
    };

    const saving =
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending;

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
                  <PermissionGate
                    permission={PERMISSIONS.UPDATE_TALENT_REQUEST}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      Edit
                    </Button>
                  </PermissionGate>
                  <PermissionGate
                    permission={PERMISSIONS.DELETE_TALENT_REQUEST}
                  >
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

              {/* Status badge (view mode) */}
              {!editing && !isCreate && row && (
                <div className="flex items-center justify-between">
                  <Badge variant={badgeVariant(form.status)}>
                    {form.status ?? "Pending"}
                  </Badge>
                </div>
              )}

              {/* Form fields */}
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

                {!isCreate && (editing || !editing) && (
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
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Action buttons */}
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

        {/* Delete confirmation */}
        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
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
