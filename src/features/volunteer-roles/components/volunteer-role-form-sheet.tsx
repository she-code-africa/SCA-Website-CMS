// src/features/volunteer-roles/components/volunteer-role-form-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X, Briefcase } from "lucide-react";

import { createVolunteerRole } from "@/features/volunteer-roles/api";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

function normalizeSkill(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function VolunteerRoleFormSheet({ open, onOpenChange }: Props) {
  const qc = useQueryClient();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [skillInput, setSkillInput] = React.useState("");

  // ✅ Team-style image UX
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canSubmit =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    skills.length > 0 &&
    !!imageFile;

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

  function reset() {
    setName("");
    setDescription("");
    setSkills([]);
    setSkillInput("");

    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // when sheet closes -> reset
  React.useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      toast.error(
        "Please fill name, description, add at least 1 skill, and upload an image."
      );
      return;
    }

    createMut.mutate({
      name: name.trim(),
      description: description.trim(),
      skills,
      image: imageFile // ✅ optional
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>Create Volunteer Role</SheetTitle>
          <SheetDescription>
            Add a new volunteer opportunity to be displayed on the website.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <form onSubmit={onSubmit} className="py-6 space-y-6">
            {/* ✅ Team-style Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Role Image <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Preview */}
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      "border-muted-foreground/25 hover:border-muted-foreground/50"
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
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Required. Square image recommended (min 400×400px). Max 5MB.
                  </p>

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

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <p className="text-xs text-muted-foreground">
                    {imageFile ? (
                      <>
                        Selected:{" "}
                        <span className="text-foreground">
                          {imageFile.name}
                        </span>
                      </>
                    ) : (
                      <p className="text-xs text-red-500">
                        Image is required to create a volunteer role.
                      </p>
                    )}
                  </p>
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
                placeholder="e.g. Support Team"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this role does..."
                className="min-h-35"
              />
            </div>

            {/* Skills */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium">Skills</label>
                <span className="text-xs text-muted-foreground">
                  Add at least 1 skill
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder='Type a skill and press "Add"'
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

              {skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="rounded-full border bg-background px-3 py-1 text-xs hover:bg-muted"
                      title="Remove"
                    >
                      {s} <span className="text-muted-foreground">×</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                  No skills added yet.
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="default"
                type="submit"
                disabled={createMut.isPending}
              >
                {createMut.isPending ? "Creating…" : "Create Role"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={createMut.isPending}
              >
                Cancel
              </Button>

              <div className="ml-auto">
                <Badge variant="secondary">{skills.length} skill(s)</Badge>
              </div>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
