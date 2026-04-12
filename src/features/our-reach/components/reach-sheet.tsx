// src/features/our-reach/components/reach-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import {
  addReach,
  editReach,
  getReach,
  deleteReach
} from "@/features/our-reach/api";
import type { Reach, ReachUpsertInput } from "@/features/our-reach/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  reachId?: string;
};

export function ReachSheet({ open, onOpenChange, mode, reachId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const reachQuery = useQuery({
    queryKey: ["reach", reachId],
    queryFn: () => getReach(String(reachId)),
    enabled: open && mode === "view" && !!reachId
  });

  const initialForm: ReachUpsertInput = React.useMemo(
    () => ({
      name: "",
      value: 0
    }),
    []
  );

  const [form, setForm] = React.useState<ReachUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      return;
    }

    if (reachQuery.data) {
      const r = reachQuery.data as Reach;
      setEditing(false);

      setForm({
        name: r.name ?? "",
        value: r.value ?? 0
      });
    }
  }, [open, mode, reachQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: addReach,
    onSuccess: () => {
      toast.success("Reach stat added");
      qc.invalidateQueries({ queryKey: ["our-reach"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add reach stat")
  });

  const updateMut = useMutation({
    mutationFn: editReach,
    onSuccess: () => {
      toast.success("Reach stat updated");
      qc.invalidateQueries({ queryKey: ["our-reach"] });
      qc.invalidateQueries({ queryKey: ["reach"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update reach stat")
  });

  const deleteMut = useMutation({
    mutationFn: deleteReach,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["our-reach"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (form.value < 0) {
      toast.error("Value must be a positive number");
      return;
    }

    if (mode === "create") {
      createMut.mutate(form);
      return;
    }

    if (!reachId) return;
    updateMut.mutate({
      id: reachId,
      data: form
    });
  };

  const saving = createMut.isPending || updateMut.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Reach Stat" : "Reach Stat Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new reach statistic."
              : "View, edit, or delete this reach stat."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_OUR_REACH}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                {/* Delete with confirmation */}
                {!editing && (
                  <PermissionGate permission={PERMISSIONS.DELETE_OUR_REACH}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="w-full sm:w-auto"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete reach stat?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!reachId) return;
                              deleteMut.mutate(reachId);
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
            )}

            {/* Preview Card */}
            {!editing && mode === "view" && (
              <div className="rounded-lg border bg-muted/50 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg border bg-background flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{form.name}</p>
                    <p className="text-4xl font-bold text-primary">
                      {new Intl.NumberFormat("en-US").format(form.value)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Women Reached, Communities Impacted"
                />
                <p className="text-xs text-muted-foreground">
                  Descriptive label for this statistic
                </p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Value *</label>
                <Input
                  type="number"
                  value={form.value}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, value: parseInt(e.target.value) || 0 })
                  }
                  placeholder="e.g., 50000"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Numeric value for this statistic
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {(mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_OUR_REACH}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={submit}
                disabled={saving}
              >
                {saving ? "Saving…" : "Add Stat"}
              </Button>
            </div>
          </PermissionGate>
        )) ||
          (mode === "view" && editing && (
            <PermissionGate permission={PERMISSIONS.UPDATE_OUR_REACH}>
              <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={submit}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </PermissionGate>
          ))}
      </SheetContent>
    </Sheet>
  );
}
