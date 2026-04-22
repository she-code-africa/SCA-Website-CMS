// src/features/volunteer-roles/components/volunteer-role-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X, Briefcase, Loader2 } from "lucide-react";

import {
  createVolunteerRole,
  deleteVolunteerRole,
  getVolunteerRole,
  updateVolunteerRole
} from "@/features/volunteer-roles/api";
import type { VolunteerRole } from "@/features/volunteer-roles/types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils/utils";

type Mode = "create" | "view" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roleId: string | null;
  mode?: Mode;
};

function normalizeSkill(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  // ... same implementation as before
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

export function VolunteerRoleSheet({
  open,
  onOpenChange,
  roleId,
  mode: initialMode = "view"
}: Props) {
  const qc = useQueryClient();

  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // form state
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [skillInput, setSkillInput] = React.useState("");

  // image handling
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const q = useQuery({
    queryKey: ["volunteer-role", roleId],
    queryFn: () => getVolunteerRole(String(roleId)),
    enabled: open && !!roleId && mode !== "create",
    staleTime: 30_000
  });

  const role = q.data as VolunteerRole | undefined;

  React.useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setName("");
      setDescription("");
      setSkills([]);
      setSkillInput("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open, mode]);

  React.useEffect(() => {
    if (!role || mode === "create") return;
    setName(role.name ?? "");
    setDescription(role.description ?? "");
    setSkills(role.skills ?? []);
    setSkillInput("");
    setImageFile(null);
    setImagePreview(role.image ?? null);
  }, [role, mode]);

  const createMut = useMutation({
    mutationFn: createVolunteerRole,
    onSuccess: () => {
      toast.success("Volunteer role created");
      qc.invalidateQueries({ queryKey: ["volunteer-roles"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? "Failed to create role";
      toast.error(message);
    }
  });

  const updateMut = useMutation({
    mutationFn: updateVolunteerRole,
    onSuccess: () => {
      toast.success("Volunteer role updated");
      qc.invalidateQueries({ queryKey: ["volunteer-roles"] });
      qc.invalidateQueries({ queryKey: ["volunteer-role", roleId] });
      setMode("view");
      setImageFile(null);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? "Failed to update role";
      toast.error(message);
    }
  });

  const deleteMut = useMutation({
    mutationFn: deleteVolunteerRole,
    onSuccess: () => {
      toast.success("Volunteer role deleted");
      qc.invalidateQueries({ queryKey: ["volunteer-roles"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete role");
    }
  });

  const canSave =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    skills.length > 0;

  function addSkill(raw?: string) {
    const v = normalizeSkill(raw ?? skillInput);
    if (!v) return;
    const exists = skills.some((x) => x.toLowerCase() === v.toLowerCase());
    if (exists) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  }

  function removeSkill(s: string) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  function cancelEdit() {
    if (mode === "create") {
      onOpenChange(false);
      return;
    }
    if (!role) return;
    setName(role.name ?? "");
    setDescription(role.description ?? "");
    setSkills(role.skills ?? []);
    setSkillInput("");
    setImageFile(null);
    setImagePreview(role.image ?? null);
    setMode("view");
  }

  async function onSave() {
    if (!canSave) {
      toast.error("Please fill name, description, and at least 1 skill.");
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

    if (mode === "create") {
      createMut.mutate({
        name: name.trim(),
        description: description.trim(),
        skills,
        image: imageValue
      });
    } else if (roleId) {
      updateMut.mutate({
        id: roleId,
        data: {
          name: name.trim(),
          description: description.trim(),
          skills,
          image: imageValue
        }
      });
    }
  }

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

  const isLoading = mode !== "create" && q.isLoading;
  const isError = mode !== "create" && q.isError;
  const saving = createMut.isPending || updateMut.isPending;
  const isEditMode = mode === "edit" || mode === "create";

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setConfirmDelete(false);
          setImageFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Create Volunteer Role" : "Volunteer Role"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new volunteer role. Image upload is optional."
              : mode === "edit"
                ? "Edit role details. Image upload is optional."
                : "View role details and manage updates."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Action buttons for view mode */}
            {mode === "view" && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setMode("edit")}
                  disabled={isLoading || isError || !roleId}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDelete(true)}
                  disabled={!roleId || deleteMut.isPending || saving}
                >
                  Delete
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <p className="text-sm text-red-500">
                Failed to load volunteer role.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{skills.length} skill(s)</Badge>
                </div>

                {/* Image upload */}
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Role Image</label>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative group">
                      <div
                        className={cn(
                          "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                          isEditMode
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
                            <Briefcase className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {isEditMode && imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image, at least 400×400px. Max 5MB.
                      </p>

                      {isEditMode && (
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
                        disabled={!isEditMode}
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      {isEditMode && (
                        <p className="text-xs text-muted-foreground">
                          {imageFile
                            ? `Selected: ${imageFile.name} (will replace current)`
                            : mode === "create"
                              ? "No image selected (optional)"
                              : "No new file selected (keeps existing image)."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditMode}
                    placeholder="e.g., Mentor, Event Organizer"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isEditMode}
                    className="min-h-35"
                    placeholder="Describe the role responsibilities..."
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium">Skills *</label>
                    {isEditMode && (
                      <span className="text-xs text-muted-foreground">
                        Press Enter to add
                      </span>
                    )}
                  </div>

                  {isEditMode && (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => addSkill()}
                        className="w-full sm:w-auto"
                      >
                        Add
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {skills.length ? (
                      skills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            isEditMode ? removeSkill(s) : undefined
                          }
                          className={[
                            "rounded-full border bg-background px-3 py-1 text-xs",
                            isEditMode
                              ? "hover:bg-muted cursor-pointer"
                              : "cursor-default"
                          ].join(" ")}
                          title={isEditMode ? "Remove" : undefined}
                        >
                          {s}
                          {isEditMode && (
                            <span className="text-muted-foreground"> ×</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground w-full">
                        No skills.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {isEditMode && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button variant="outline" onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={onSave}
              disabled={saving || !canSave}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating…" : "Saving…"}
                </>
              ) : mode === "create" ? (
                "Create Role"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}

        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this role?</AlertDialogTitle>
              <AlertDialogDescription>
                This action can’t be undone. This role will be removed from the
                admin dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMut.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => roleId && deleteMut.mutate(roleId)}
                disabled={deleteMut.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMut.isPending ? "Deleting…" : "Yes, delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
