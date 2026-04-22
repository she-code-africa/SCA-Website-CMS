// src/features/stem-a-girl/courses/components/course-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, Link as LinkIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import type { Course, CourseState, CourseUpsertInput } from "../types";
import { createCourse, deleteCourse, getCourse, updateCourse } from "../api";
import { getSAGActivities } from "@/features/stem-a-girl/activities/api";
import type { SAGActivity } from "@/features/stem-a-girl/activities/types";
import { compressImage, getActivityId } from "../utils";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  courseId?: string;
};

export function CourseSheet({ open, onOpenChange, mode, courseId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ─── Queries ───────────────────────────────────────────────────────────────
  const courseQuery = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(String(courseId)),
    enabled: open && mode === "view" && !!courseId
  });

  const activitiesQuery = useQuery({
    queryKey: ["sag-activities"],
    queryFn: () => getSAGActivities({}),
    enabled: open,
    staleTime: 60_000
  });

  const activities = (activitiesQuery.data ?? []) as SAGActivity[];

  // ─── Form state ────────────────────────────────────────────────────────────
  const initialForm: CourseUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      link: "",
      activity: "",
      state: "draft",
      difficulty: "",
      estimatedHours: "",
      featured: false
      // image is omitted – we handle it separately
    }),
    []
  );

  const [form, setForm] = React.useState<CourseUpsertInput>(initialForm);

  // ─── Populate form when course data arrives (view mode) ───────────────────
  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (courseQuery.data) {
      const c = courseQuery.data as Course;
      setEditing(false);
      setImageFile(null);
      setImagePreview(c.image ?? null);

      setForm({
        title: c.title ?? "",
        description: c.description ?? "",
        link: c.link ?? "",
        activity: getActivityId(c),
        state: (c.state ?? "draft") as CourseState,
        difficulty: c.difficulty ?? "",
        estimatedHours: c.estimatedHours ?? "",
        featured: c.featured ?? false
      });
    }
  }, [open, mode, courseQuery.data, initialForm]);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created");
      qc.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not create course")
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCourse(id, data),
    onSuccess: () => {
      toast.success("Course updated");
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", courseId] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update course")
  });

  const deleteMut = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete course")
  });

  const saving = createMut.isPending || updateMut.isPending;

  // ─── Image handling ────────────────────────────────────────────────────────
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

  // ─── Submit handler – sends image as base64 string, omits field if none ───
  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !(form.link ?? "").trim() ||
      !form.activity
    ) {
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
      description: form.description.trim(),
      link: (form.link ?? "").trim(),
      activity: form.activity, // already a string ID
      state: form.state,
      difficulty: form.difficulty,
      estimatedHours: form.estimatedHours,
      featured: form.featured
    };

    if (imageValue) {
      payload.image = imageValue;
    }

    if (mode === "create") {
      createMut.mutate(payload);
      return;
    }

    if (!courseId) return;
    updateMut.mutate({ id: courseId, data: payload });
  };

  // ─── Skeleton loader while fetching course data ───────────────────────────
  if (mode === "view" && courseQuery.isLoading && !courseQuery.data) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col"
        >
          <VisuallyHidden>
            <SheetTitle>Loading course details</SheetTitle>
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
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Course" : "Course Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Create a new course."
              : editing
                ? "Edit the course details."
                : "View course details. Click Edit to modify."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Edit button – requires UPDATE permission */}
                <PermissionGate permission={PERMISSIONS.UPDATE_SAG_COURSE}>
                  <Button
                    variant="outline"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                {/* Delete button – requires DELETE permission */}
                {!editing && (
                  <PermissionGate permission={PERMISSIONS.DELETE_SAG_COURSE}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete course?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              courseId && deleteMut.mutate(courseId)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMut.isPending}
                          >
                            {deleteMut.isPending ? "Deleting…" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </PermissionGate>
                )}
              </div>
            )}

            {/* Image upload (always visible but disabled when not editing) */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Course Image</label>
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
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
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
                    >
                      <Upload className="h-4 mr-2" /> Choose Image
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

            {/* Form fields */}
            <div className="grid gap-4">
              {/* ... existing fields (unchanged) ... */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Course title"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Link *</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={form.link}
                    disabled={!editing}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Activity *</label>
                <Select
                  value={form.activity}
                  onValueChange={(v) => setForm({ ...form, activity: v })}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        activitiesQuery.isLoading
                          ? "Loading…"
                          : "Select activity"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Input
                    value={form.difficulty}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value })
                    }
                    placeholder="Beginner"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Est. Hours</label>
                  <Input
                    value={form.estimatedHours}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, estimatedHours: e.target.value })
                    }
                    placeholder="9-12 hours"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">
                    Display prominently on website
                  </p>
                </div>
                <Switch
                  checked={form.featured}
                  disabled={!editing}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
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
                  placeholder="Describe the course..."
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">State</label>
                <Select
                  value={form.state}
                  onValueChange={(v) =>
                    setForm({ ...form, state: v as CourseState })
                  }
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar – requires CREATE permission for create mode, UPDATE for edit mode */}
        {(mode === "create" || (mode === "view" && editing)) && (
          <PermissionGate
            permission={
              mode === "create"
                ? PERMISSIONS.CREATE_SAG_COURSE
                : PERMISSIONS.UPDATE_SAG_COURSE
            }
          >
            <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
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
              <Button variant="default" onClick={submit} disabled={saving}>
                {saving
                  ? "Saving…"
                  : mode === "create"
                    ? "Add Course"
                    : "Save Changes"}
              </Button>
            </div>
          </PermissionGate>
        )}
      </SheetContent>
    </Sheet>
  );
}
