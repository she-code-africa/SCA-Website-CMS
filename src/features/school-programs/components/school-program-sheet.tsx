"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, FileText } from "lucide-react";
import {
  createSchoolProgram,
  editSchoolProgram,
  getSchoolProgram,
  publishSchoolProgram,
  archiveSchoolProgram,
  deleteSchoolProgram
} from "@/features/school-programs/api";
import { getSchools } from "@/features/schools/api";
import type {
  SchoolProgram,
  SchoolProgramUpsertInput
} from "@/features/school-programs/types";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  programId?: string;
};

export function SchoolProgramSheet({
  open,
  onOpenChange,
  mode,
  programId
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: () => getSchools(),
    enabled: open
  });

  const programQuery = useQuery({
    queryKey: ["school-program", programId],
    queryFn: () => getSchoolProgram(String(programId)),
    enabled: open && mode === "view" && !!programId
  });

  const initialForm: SchoolProgramUpsertInput = React.useMemo(
    () => ({
      title: "",
      cohort: "",
      briefContent: "",
      extendedContent: "",
      school: "",
      link: "",
      image: null
    }),
    []
  );

  const [form, setForm] = React.useState<SchoolProgramUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (programQuery.data) {
      const p = programQuery.data as SchoolProgram;
      setEditing(false);
      setImageFile(null);

      // Set existing image preview if available
      if (p.image) {
        setImagePreview(p.image);
      } else {
        setImagePreview(null);
      }

      setForm({
        title: p.title ?? "",
        cohort: p.cohort ?? "",
        briefContent: p.briefContent ?? "",
        extendedContent: p.extendedContent ?? "",
        school:
          typeof p.school === "string" ? p.school : (p.school?._id ?? ""),
        link: p.link ?? "",
        image: null
      });
    }
  }, [open, mode, programQuery.data, initialForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createMut = useMutation({
    mutationFn: createSchoolProgram,
    onSuccess: () => {
      toast.success("Program added");
      qc.invalidateQueries({ queryKey: ["school-programs"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add program")
  });

  const updateMut = useMutation({
    mutationFn: editSchoolProgram,
    onSuccess: () => {
      toast.success("Program updated");
      qc.invalidateQueries({ queryKey: ["school-programs"] });
      qc.invalidateQueries({ queryKey: ["school-program"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update program")
  });

  const publishMut = useMutation({
    mutationFn: publishSchoolProgram,
    onSuccess: () => {
      toast.success("Published");
      qc.invalidateQueries({ queryKey: ["school-programs"] });
      qc.invalidateQueries({ queryKey: ["school-program"] });
    },
    onError: () => toast.error("Could not publish")
  });

  const archiveMut = useMutation({
    mutationFn: archiveSchoolProgram,
    onSuccess: () => {
      toast.success("Archived");
      qc.invalidateQueries({ queryKey: ["school-programs"] });
      qc.invalidateQueries({ queryKey: ["school-program"] });
    },
    onError: () => toast.error("Could not archive")
  });

  const deleteMut = useMutation({
    mutationFn: deleteSchoolProgram,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["school-programs"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.cohort ||
      !form.briefContent.trim() ||
      !form.extendedContent.trim() ||
      !form.school ||
      !form.link.trim()
    ) {
      toast.error("Please fill all required fields");
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

    if (!programId) return;
    updateMut.mutate({
      id: programId,
      data: { ...form, image: imageFile ?? undefined }
    });
  };

  const currentState = (programQuery.data as SchoolProgram | undefined)?.state;
  const saving = createMut.isPending || updateMut.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add School Program" : "Program Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new school program."
              : "View, edit, publish/archive, or delete this program."}
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

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      if (!programId) return;
                      if (currentState === "published")
                        archiveMut.mutate(programId);
                      else publishMut.mutate(programId);
                    }}
                    disabled={publishMut.isPending || archiveMut.isPending}
                  >
                    {currentState === "published" ? "Archive" : "Publish"}
                  </Button>

                  {/* Delete with confirmation */}
                  {!editing && (
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
                            Delete school program?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!programId) return;
                              deleteMut.mutate(programId);
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
              </div>
            )}

            {/* Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Program Image *</label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Image Preview */}
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
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
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

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 400x400px. Max 5MB.
                    </p>
                  </div>

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

                  {/* Hidden file input */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Program title"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Cohort *</label>
                <Input
                  type="number"
                  value={form.cohort}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, cohort: e.target.value })
                  }
                  placeholder="1"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">School *</label>
                <Select
                  value={form.school}
                  onValueChange={(v) => setForm({ ...form, school: v })}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Link *</label>
                <Input
                  type="url"
                  value={form.link}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Brief Content *</label>
              <Textarea
                value={form.briefContent}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, briefContent: e.target.value })
                }
                rows={3}
                placeholder="Short description..."
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Extended Content *</label>
              <Textarea
                value={form.extendedContent}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, extendedContent: e.target.value })
                }
                rows={8}
                placeholder="Detailed description..."
              />
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
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
                  ? "Add Program"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}