// src/features/schools/components/school-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSchool,
  editSchool,
  getSchool,
  deleteSchool
} from "@/features/schools/api";
import type { School, SchoolUpsertInput } from "@/features/schools/types";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton"; // <-- added
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  schoolId?: string;
  onUpdate?: () => Promise<void>; // <-- added for table skeleton
};

export function SchoolSheet({
  open,
  onOpenChange,
  mode,
  schoolId,
  onUpdate
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const schoolQuery = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => getSchool(String(schoolId)),
    enabled: open && mode === "view" && !!schoolId
  });

  const initialForm: SchoolUpsertInput = React.useMemo(
    () => ({
      name: "",
      description: ""
    }),
    []
  );

  const [form, setForm] = React.useState<SchoolUpsertInput>(initialForm);

  // Reset form when sheet opens / schoolId changes
  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      return;
    }

    // For view mode, reset form to initial while loading to avoid flash of old data
    if (mode === "view") {
      setForm(initialForm);
      setEditing(false);
      // The effect below will update form when data arrives
    }
  }, [open, mode, schoolId, initialForm]); 

  // Populate form when school data arrives
  React.useEffect(() => {
    if (open && mode === "view" && schoolQuery.data) {
      const s = schoolQuery.data as School;
      setEditing(false);
      setForm({
        name: s.name ?? "",
        description: s.description ?? ""
      });
    }
  }, [schoolQuery.data, open, mode]);

  const createMut = useMutation({
    mutationFn: createSchool,
    onSuccess: async () => {
      toast.success("School added");
      await onUpdate?.(); // triggers table skeleton
      qc.invalidateQueries({ queryKey: ["schools"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add school")
  });

  const updateMut = useMutation({
    mutationFn: editSchool,
    onSuccess: async () => {
      toast.success("School updated");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["schools"] });
      qc.invalidateQueries({ queryKey: ["school"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update school")
  });

  const deleteMut = useMutation({
    mutationFn: deleteSchool,
    onSuccess: async () => {
      toast.success("Deleted");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["schools"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (mode === "create") {
      createMut.mutate(form);
      return;
    }

    if (!schoolId) return;
    updateMut.mutate({ schoolId, data: form });
  };

  const saving = createMut.isPending || updateMut.isPending;

  // Loading skeleton for view mode while fetching the school detail
  const isLoadingDetail =
    mode === "view" && !!schoolId && schoolQuery.isLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add School" : "School Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new school to the system."
              : "View, edit, or delete this school."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            {mode === "view" && !isLoadingDetail && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_SCHOOL}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                <div className="flex gap-2 w-full sm:w-auto">
                  {!editing && (
                    <PermissionGate permission={PERMISSIONS.DELETE_SCHOOL}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1 sm:flex-none"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete school?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (!schoolId) return;
                                deleteMut.mutate(schoolId);
                              }}
                              className={cn(
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              )}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PermissionGate>
                  )}
                </div>
              </div>
            )}

            {/* Skeleton while loading detail */}
            {isLoadingDetail ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={form.name}
                      disabled={!editing}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="School name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea
                      value={form.description}
                      disabled={!editing}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={8}
                      placeholder="School description..."
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {!isLoadingDetail &&
          ((mode === "create" && (
            <PermissionGate permission={PERMISSIONS.CREATE_SCHOOL}>
              <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={submit} disabled={saving}>
                  {saving ? "Saving…" : "Add School"}
                </Button>
              </div>
            </PermissionGate>
          )) ||
            (mode === "view" && editing && (
              <PermissionGate permission={PERMISSIONS.UPDATE_SCHOOL}>
                <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button variant="default" onClick={submit} disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </PermissionGate>
            )))}
      </SheetContent>
    </Sheet>
  );
}
