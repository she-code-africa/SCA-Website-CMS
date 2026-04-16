"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Upload, X } from "lucide-react";
import {
  addInitiative,
  editInitiative,
  getInitiative,
  deleteInitiative
} from "@/features/initiatives/api";
import type {
  Initiative,
  InitiativeUpsertInput
} from "@/features/initiatives/types";
import { Skeleton } from "@/components/ui/skeleton";

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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  initiativeId?: string;
};

// Image compression helper (if needed, but backend accepts File via FormData)
// Keeping as is, but we'll add skeleton loader and remove publish/archive.

export function InitiativeSheet({
  open,
  onOpenChange,
  mode,
  initiativeId
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const initiativeQuery = useQuery({
    queryKey: ["initiative", initiativeId],
    queryFn: () => getInitiative(String(initiativeId)),
    enabled: open && mode === "view" && !!initiativeId
  });

  const initialForm: InitiativeUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      initiative_url: "",
      donation_url: "",
      isAvailable: false,
      image: null
    }),
    []
  );

  const [form, setForm] = React.useState<InitiativeUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (initiativeQuery.data) {
      const i = initiativeQuery.data as Initiative;
      setEditing(false);
      setImageFile(null);
      setImagePreview(i.image ?? null);
      setForm({
        title: i.title ?? "",
        description: i.description ?? "",
        initiative_url: i.initiative_url ?? "",
        donation_url: i.donation_url ?? "",
        isAvailable: i.isAvailable ?? false,
        image: null
      });
    }
  }, [open, mode, initiativeQuery.data, initialForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const createMut = useMutation({
    mutationFn: addInitiative,
    onSuccess: () => {
      toast.success("Initiative added");
      qc.invalidateQueries({ queryKey: ["initiatives"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not add initiative")
  });

  const updateMut = useMutation({
    mutationFn: editInitiative,
    onSuccess: () => {
      toast.success("Initiative updated");
      qc.invalidateQueries({ queryKey: ["initiatives"] });
      qc.invalidateQueries({ queryKey: ["initiative"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update initiative")
  });

  const deleteMut = useMutation({
    mutationFn: deleteInitiative,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["initiatives"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.initiative_url.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      new URL(form.initiative_url);
      if (form.donation_url.trim()) {
        new URL(form.donation_url);
      }
    } catch {
      toast.error("Please enter valid URLs");
      return;
    }

    if (mode === "create") {
      if (!imageFile) {
        toast.error("Please upload an image");
        return;
      }
      createMut.mutate({ ...form, image: imageFile });
      return;
    }

    if (!initiativeId) return;
    updateMut.mutate({
      id: initiativeId,
      data: { ...form, image: imageFile ?? undefined }
    });
  };

  const saving = createMut.isPending || updateMut.isPending;

  // Skeleton loader while fetching
  if (mode === "view" && initiativeQuery.isLoading && !initiativeQuery.data) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </SheetHeader>
          <div className="flex-1 px-6 py-6 space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full rounded-lg" />
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
            {mode === "create" ? "Add Initiative" : "Initiative Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new initiative."
              : editing
                ? "Edit the initiative details."
                : "View initiative details. Click Edit to modify."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setEditing((v) => !v)}
                >
                  {editing ? "View" : "Edit"}
                </Button>

                {/* Delete – only when NOT editing */}
                {!editing && (
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
                        <AlertDialogTitle>Delete initiative?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (!initiativeId) return;
                            deleteMut.mutate(initiativeId);
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
                )}
              </div>
            )}

            {/* Initiative Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Initiative Image {mode === "create" && "*"}
              </label>

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
                        <Lightbulb className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {editing && imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 400x400px. Max 5MB.
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.title}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Initiative Name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Initiative URL *</label>
                <Input
                  type="url"
                  value={form.initiative_url}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, initiative_url: e.target.value })
                  }
                  placeholder="https://example.com/initiative"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Donation URL</label>
                <Input
                  type="url"
                  value={form.donation_url}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, donation_url: e.target.value })
                  }
                  placeholder="https://example.com/donate"
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
                  rows={10}
                  placeholder="Describe the initiative..."
                />
                <p className="text-xs text-muted-foreground">
                  You can use basic HTML formatting if needed.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-xs text-muted-foreground">
                    Mark if this initiative is currently available
                  </p>
                </div>
                <Switch
                  checked={form.isAvailable}
                  disabled={!editing}
                  onCheckedChange={(v) => setForm({ ...form, isAvailable: v })}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {(mode === "create" || editing) && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                if (editing && mode === "view") setEditing(false);
                else onOpenChange(false);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700"
              onClick={submit}
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Add Initiative"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
