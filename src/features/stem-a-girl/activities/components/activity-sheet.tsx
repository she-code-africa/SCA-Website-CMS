// src/features/stem-a-girl/activities/components/activity-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, Activity as ActivityIcon } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import type { SAGActivity, SAGActivityUpsertInput } from "../types";
import {
  createSAGActivity,
  deleteSAGActivity,
  editSAGActivity,
  getSAGActivity
} from "../api";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/utils";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  activityId?: string;
};

// Image compression helper
const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export function ActivitySheet({ open, onOpenChange, mode, activityId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const initialForm: SAGActivityUpsertInput = React.useMemo(
    () => ({ title: "", description: "", image: null }),
    []
  );
  const [form, setForm] = React.useState<SAGActivityUpsertInput>(initialForm);

  const activityQuery = useQuery({
    queryKey: ["sag-activity", activityId],
    queryFn: () => getSAGActivity(String(activityId)),
    enabled: open && mode === "view" && !!activityId
  });

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (activityQuery.data) {
      const a = activityQuery.data as SAGActivity;
      setEditing(false);
      setImageFile(null);
      setImagePreview(a.image ?? null);

      setForm({
        title: a.title ?? "",
        description: a.description ?? "",
        image: null
      });
    }
  }, [open, mode, activityQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: createSAGActivity,
    onSuccess: () => {
      toast.success("Activity created");
      qc.invalidateQueries({ queryKey: ["sag-activities"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not create activity")
  });

  const updateMut = useMutation({
    mutationFn: editSAGActivity,
    onSuccess: () => {
      toast.success("Activity updated");
      qc.invalidateQueries({ queryKey: ["sag-activities"] });
      qc.invalidateQueries({ queryKey: ["sag-activity"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update activity")
  });

  const deleteMut = useMutation({
    mutationFn: deleteSAGActivity,
    onSuccess: () => {
      toast.success("Activity deleted");
      qc.invalidateQueries({ queryKey: ["sag-activities"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete activity")
  });

  const saving = createMut.isPending || updateMut.isPending;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill required fields");
      return;
    }

    let imageValue: string | undefined = undefined;
    if (imageFile) {
      try {
        imageValue = await compressImage(imageFile, 800, 800, 0.7);
      } catch {
        toast.error("Failed to process image");
        return;
      }
    }

    const payload: any = {
      title: form.title.trim(),
      description: form.description.trim()
    };
    if (imageValue) payload.image = imageValue;

    if (mode === "create") {
      createMut.mutate(payload);
      return;
    }

    if (!activityId) return;
    updateMut.mutate({ id: activityId, data: payload });
  };

  // Skeleton loader while fetching activity data
  if (mode === "view" && activityQuery.isLoading && !activityQuery.data) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col"
        >
          <VisuallyHidden>
            <SheetTitle>Loading activity details</SheetTitle>
          </VisuallyHidden>
          <SheetHeader className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </SheetHeader>
          <div className="flex-1 px-6 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Skeleton className="w-32 h-32 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
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
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Activity" : "Activity Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Create a new activity."
              : editing
                ? "Edit the activity details."
                : "View activity details. Click Edit to modify."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "View" : "Edit"}
                </Button>

                {!editing && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete activity?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            activityId && deleteMut.mutate(activityId)
                          }
                          className={cn(
                            "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          )}
                          disabled={deleteMut.isPending}
                        >
                          {deleteMut.isPending ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}

            {/* Image upload */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Activity Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      editing
                        ? "border-muted-foreground/25 hover:border-muted-foreground/50"
                        : "border-muted-foreground/25"
                    )}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ActivityIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {editing && imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Recommended: 800×800px. Max 5MB.
                  </p>
                  {editing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={!editing}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Activity title"
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
                  rows={7}
                  placeholder="Describe this activity..."
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {(mode === "create" || editing) && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={submit} disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Add Activity"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
