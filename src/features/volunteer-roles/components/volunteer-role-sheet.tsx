// src/features/volunteer-roles/components/volunteer-role-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X, Briefcase } from "lucide-react";

import {
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

type Mode = "view" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roleId: string | null;
  mode?: Mode;
};

function normalizeSkill(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

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

  // ✅ team-like image handling
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const q = useQuery({
    queryKey: ["volunteer-role", roleId],
    queryFn: () => getVolunteerRole(String(roleId)),
    enabled: open && !!roleId,
    staleTime: 30_000
  });

  const role = q.data as VolunteerRole | undefined;

  React.useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  // hydrate form + preview from fetched role
  React.useEffect(() => {
    if (!role) return;

    setName(role.name ?? "");
    setDescription(role.description ?? "");
    setSkills(role.skills ?? []);
    setSkillInput("");

    setImageFile(null);
    setImagePreview(role.image ?? null); // ✅ show existing url
  }, [role]);

  const updateMut = useMutation({
    mutationFn: updateVolunteerRole,
    onSuccess: () => {
      toast.success("Volunteer role updated");
      qc.invalidateQueries({ queryKey: ["volunteer-roles"] });
      qc.invalidateQueries({ queryKey: ["volunteer-role", roleId] });
      setMode("view");
      setImageFile(null);
      // keep imagePreview as whatever is in fetched role after refetch
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
    if (!role) return;
    setName(role.name ?? "");
    setDescription(role.description ?? "");
    setSkills(role.skills ?? []);
    setSkillInput("");

    setImageFile(null);
    setImagePreview(role.image ?? null);

    setMode("view");
  }

  function onSave() {
    if (!roleId) return;
    if (!canSave) {
      toast.error("Please fill name, description, and at least 1 skill.");
      return;
    }

    // ✅ image optional:
    // if imageFile is null => toFormData won't append it => backend keeps existing image
    updateMut.mutate({
      id: roleId,
      data: {
        name: name.trim(),
        description: description.trim(),
        skills,
        image: imageFile ?? undefined
      }
    });
  }

  // ✅ image UX same as team
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
    setImagePreview(null); // sets to none (won’t delete on backend, just preview)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isLoading = q.isLoading;
  const isError = q.isError;
  const saving = updateMut.isPending;

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
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <SheetTitle>Volunteer Role</SheetTitle>
              <SheetDescription>
                {mode === "edit"
                  ? "Edit role details. Image upload is optional."
                  : "View role details and manage updates."}
              </SheetDescription>
            </div>

            <div className="flex gap-2">
              {mode === "view" ? (
                <Button
                  variant="secondary"
                  onClick={() => setMode("edit")}
                  disabled={isLoading || isError || !roleId}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}

              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => setConfirmDelete(true)}
                disabled={!roleId || deleteMut.isPending || saving}
              >
                Delete
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : isError || !role ? (
              <p className="text-sm text-red-500">
                Failed to load volunteer role.
              </p>
            ) : (
              <>
                {/* Meta */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{skills.length} skill(s)</Badge>
                </div>

                {/* ✅ Image upload (Team-like) */}
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Role Image</label>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Preview */}
                    <div className="relative group">
                      <div
                        className={cn(
                          "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                          mode === "edit"
                            ? "border-muted-foreground/25 hover:border-muted-foreground/50"
                            : "border-muted-foreground/25"
                        )}
                      >
                        {imagePreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
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

                      {/* Remove */}
                      {mode === "edit" && imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image, at least 400×400px. Max 5MB.
                      </p>

                      {mode === "edit" && (
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
                        disabled={mode !== "edit"}
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      {mode === "edit" && (
                        <p className="text-xs text-muted-foreground">
                          {imageFile
                            ? `Selected: ${imageFile.name} (will replace current)`
                            : "No new file selected (keeps existing image)."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Name */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={mode !== "edit"}
                  />
                </div>

                {/* Description */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={mode !== "edit"}
                    className="min-h-[140px]"
                  />
                </div>

                {/* Skills */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium">Skills</label>
                    {mode === "edit" ? (
                      <span className="text-xs text-muted-foreground">
                        Press Enter to add
                      </span>
                    ) : null}
                  </div>

                  {mode === "edit" ? (
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
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {skills.length ? (
                      skills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            mode === "edit" ? removeSkill(s) : undefined
                          }
                          className={[
                            "rounded-full border bg-background px-3 py-1 text-xs",
                            mode === "edit"
                              ? "hover:bg-muted cursor-pointer"
                              : "cursor-default"
                          ].join(" ")}
                          title={mode === "edit" ? "Remove" : undefined}
                        >
                          {s}
                          {mode === "edit" ? (
                            <span className="text-muted-foreground"> ×</span>
                          ) : null}
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

        {/* Bottom action bar (like Team) */}
        {mode === "edit" && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button variant="outline" onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={onSave}
              disabled={saving || !canSave}
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        )}

        {/* Delete confirm */}
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
