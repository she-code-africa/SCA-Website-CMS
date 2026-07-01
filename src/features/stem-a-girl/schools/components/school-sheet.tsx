// src/features/stem-a-girl/schools/components/school-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, School as SchoolIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { SAGSchool, SAGSchoolUpsertInput } from "../types";
import { createSAGSchool, deleteSAGSchool, editSAGSchool, getSAGSchool } from "../api";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  schoolId?: string;
};

export function SchoolSheet({ open, onOpenChange, mode, schoolId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const initialForm: SAGSchoolUpsertInput = React.useMemo(
    () => ({
      name: "",
      description: "",
      image: null
    }),
    []
  );

  const [form, setForm] = React.useState<SAGSchoolUpsertInput>(initialForm);

  const schoolQuery = useQuery({
    queryKey: ["sag-school", schoolId],
    queryFn: () => getSAGSchool(String(schoolId)),
    enabled: open && mode === "view" && !!schoolId
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

    if (schoolQuery.data) {
      const s = schoolQuery.data as SAGSchool;

      setEditing(false);
      setImageFile(null);
      setImagePreview(s.image ?? null);

      setForm({
        name: s.name ?? "",
        description: s.description ?? "",
        image: null
      });
    }
  }, [open, mode, schoolQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: createSAGSchool,
    onSuccess: () => {
      toast.success("School created");
      qc.invalidateQueries({ queryKey: ["sag-schools"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not create school")
  });

  const updateMut = useMutation({
    mutationFn: editSAGSchool,
    onSuccess: () => {
      toast.success("School updated");
      qc.invalidateQueries({ queryKey: ["sag-schools"] });
      qc.invalidateQueries({ queryKey: ["sag-school"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update school")
  });

  const deleteMut = useMutation({
    mutationFn: deleteSAGSchool,
    onSuccess: () => {
      toast.success("School deleted");
      qc.invalidateQueries({ queryKey: ["sag-schools"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete school")
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

  const submit = () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Please fill required fields");
      return;
    }

    if (mode === "create") {
      createMut.mutate({ ...form, image: imageFile });
      return;
    }

    if (!schoolId) return;
    updateMut.mutate({
      id: schoolId,
      data: {
        ...form,
        image: imageFile ?? undefined
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>{mode === "create" ? "Add School" : "School Details"}</SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Create a new school."
              : "View, edit, or delete this school."}
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

                {!editing && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full sm:w-auto">
                        <Trash2 className="h-4 w-4 mr-2" />
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
                          onClick={() => schoolId && deleteMut.mutate(schoolId)}
                          className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")}
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
              <label className="text-sm font-medium">School Image</label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      editing ? "border-muted-foreground/25 hover:border-muted-foreground/50" : "border-muted-foreground/25"
                    )}
                  >
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <SchoolIcon className="w-12 h-12 text-muted-foreground" />
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
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="School name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={form.description}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={7}
                  placeholder="Describe this school..."
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {(mode === "create" || editing) && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="default" onClick={submit} disabled={saving}>
              {saving ? "Saving…" : mode === "create" ? "Add School" : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
