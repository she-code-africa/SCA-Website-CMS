"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTestimonial,
  editTestimonial,
  deleteTestimonial,
  getTestimonial
} from "@/features/testimonials/api";
import type {
  Testimonial,
  TestimonialUpsertInput
} from "@/features/testimonials/types";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  testimonialId?: string;
};

export function TestimonialSheet({
  open,
  onOpenChange,
  mode,
  testimonialId
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const testimonialQuery = useQuery({
    queryKey: ["testimonial", testimonialId],
    queryFn: () => getTestimonial(String(testimonialId)),
    enabled: open && mode === "view" && !!testimonialId
  });

  const initialForm: TestimonialUpsertInput = React.useMemo(
    () => ({
      name: "",
      role: "",
      testimonial: "",
      image: null
    }),
    []
  );

  const [form, setForm] = React.useState<TestimonialUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      return;
    }

    if (testimonialQuery.data) {
      const t = testimonialQuery.data as Testimonial;
      setEditing(false);
      setForm({
        name: t.name ?? "",
        role: t.role ?? "",
        testimonial: t.testimonial ?? "",
        image: null
      });
    }
  }, [open, mode, testimonialQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: addTestimonial,
    onSuccess: () => {
      toast.success("Testimonial added");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add testimonial")
  });

  const updateMut = useMutation({
    mutationFn: editTestimonial,
    onSuccess: () => {
      toast.success("Testimonial updated");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      qc.invalidateQueries({ queryKey: ["testimonial"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update testimonial")
  });

  const deleteMut = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.testimonial.trim()) {
      toast.error("Please fill required fields");
      return;
    }

    if (mode === "create") {
      createMut.mutate(form);
      return;
    }

    if (!testimonialId) return;
    updateMut.mutate({
      id: testimonialId,
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
            {mode === "create" ? "Add Testimonial" : "Testimonial Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new testimonial."
              : "View, edit, or delete this testimonial."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row (view mode only) */}
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_TESTIMONIALS}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                {/* Delete – only when NOT editing */}
                {!editing && (
                  <PermissionGate permission={PERMISSIONS.DELETE_TESTIMONIALS}>
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
                          <AlertDialogTitle>
                            Delete testimonial?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!testimonialId) return;
                              deleteMut.mutate(testimonialId);
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Role *</label>
                <Input
                  value={form.role}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Testimonial *</label>
              <Textarea
                value={form.testimonial}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, testimonial: e.target.value })
                }
                rows={10}
                placeholder="Share your experience..."
              />
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_TESTIMONIALS}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Add Testimonial"}
              </Button>
            </div>
          </PermissionGate>
        )}

        {mode === "view" && editing && (
          <PermissionGate permission={PERMISSIONS.UPDATE_TESTIMONIALS}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </PermissionGate>
        )}
      </SheetContent>
    </Sheet>
  );
}
