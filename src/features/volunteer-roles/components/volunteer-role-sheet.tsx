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
import { Skeleton } from "@/components/ui/skeleton";

type Mode = "create" | "view"; // simplified – no external "edit"

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roleId: string | null;
  mode: Mode;
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
  mode
}: Props) {
  const qc = useQueryClient();

  // ---------- internal editing toggle ----------
  const [editing, setEditing] = React.useState(mode === "create");

  // ---------- delete confirmation ----------
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // ---------- form fields ----------
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [skillInput, setSkillInput] = React.useState("");

  // ---------- image ----------
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ---------- data fetching ----------
  const roleQuery = useQuery({
    queryKey: ["volunteer-role", roleId],
    queryFn: () => getVolunteerRole(String(roleId)),
    enabled: open && !!roleId && mode === "view",
    staleTime: 30_000
  });

  const role = roleQuery.data as VolunteerRole | undefined;

  // ---------- reset when sheet opens or mode changes ----------
  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setName("");
      setDescription("");
      setSkills([]);
      setSkillInput("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // view mode: form will be populated when role data arrives
    setEditing(false);
    setSkillInput("");
    setImageFile(null);
  }, [open, mode]);

  // ---------- populate form when role data loads ----------
  React.useEffect(() => {
    if (!role || mode === "create") return;
    setName(role.name ?? "");
    setDescription(role.description ?? "");
    setSkills(role.skills ?? []);
    setImagePreview(role.image ?? null);
  }, [role, mode]);

  // ---------- mutations ----------
  const createMut = useMutation({
    mutationFn: createVolunteerRole,
    onSuccess: () => {
      toast.success("Volunteer role created");
      qc.invalidateQueries({ queryKey: ["volunteer-roles"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to create role");
    }
  });

  const updateMut = useMutation({
    mutationFn: updateVolunteerRole,
    onSuccess: () => {
      toast.success("Volunteer role updated");
      qc.invalidateQueries({ queryKey: ["volunteer-roles"] });
      qc.invalidateQueries({ queryKey: ["volunteer-role", roleId] });
      setEditing(false); // switch back to view
      setImageFile(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update role");
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

  // ---------- helpers ----------
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
    // revert to saved role data
    if (!role) return;
    setName(role.name ?? "");
    setDescription(role.description ?? "");
    setSkills(role.skills ?? []);
    setSkillInput("");
    setImageFile(null);
    setImagePreview(role.image ?? null);
    setEditing(false);
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

  // ---------- image handlers ----------
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

  // ---------- derived booleans ----------
  const isFormEditable = mode === "create" || editing;
  const isLoading = mode === "view" && roleQuery.isLoading;
  const isError = mode === "view" && roleQuery.isError;
  const saving = createMut.isPending || updateMut.isPending;

  // ---------- Skeleton loader ----------
  if (mode === "view" && roleQuery.isLoading && !roleQuery.data) {
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
            <Skeleton className="h-24 w-full" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

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
              : editing
                ? "Edit role details. Image upload is optional."
                : "View role details and manage updates."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* ---------- View mode action buttons ---------- */}
            {mode === "view" && !editing && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
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

            {/* ---------- Loading / Error state ---------- */}
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
                {/* ---------- Skills badge ---------- */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{skills.length} skill(s)</Badge>
                </div>

                {/* ---------- Image upload ---------- */}
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Role Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative group">
                      <div
                        className={cn(
                          "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                          isFormEditable
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
                      {isFormEditable && imagePreview && (
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
                      {isFormEditable && (
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
                        disabled={!isFormEditable}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {isFormEditable && (
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

                {/* ---------- Role Name ---------- */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isFormEditable}
                    placeholder="e.g., Mentor, Event Organizer"
                  />
                </div>

                {/* ---------- Description ---------- */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isFormEditable}
                    className="min-h-35"
                    placeholder="Describe the role responsibilities..."
                  />
                </div>

                {/* ---------- Skills ---------- */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium">Skills *</label>
                    {isFormEditable && (
                      <span className="text-xs text-muted-foreground">
                        Press Enter to add
                      </span>
                    )}
                  </div>

                  {isFormEditable && (
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
                            isFormEditable ? removeSkill(s) : undefined
                          }
                          className={[
                            "rounded-full border bg-background px-3 py-1 text-xs",
                            isFormEditable
                              ? "hover:bg-muted cursor-pointer"
                              : "cursor-default"
                          ].join(" ")}
                          title={isFormEditable ? "Remove" : undefined}
                        >
                          {s}
                          {isFormEditable && (
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

        {/* ---------- Bottom action bar (create / edit mode) ---------- */}
        {isFormEditable && (
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

        {/* ---------- Delete confirmation ---------- */}
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