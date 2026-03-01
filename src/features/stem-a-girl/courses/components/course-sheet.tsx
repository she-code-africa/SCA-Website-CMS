// src/features/stem-a-girl/courses/components/course-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, Link as LinkIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";

import type { SAGCourse, SAGCourseUpsertInput, SAGCourseState } from "../types";
import {
  createSAGCourse,
  deleteSAGCourse,
  editSAGCourse,
  getSAGCourse
} from "../api";
import { getSAGActivities } from "@/features/stem-a-girl/activities/api";
import type { SAGActivity } from "@/features/stem-a-girl/activities/types";
import { activityId } from "../utils";

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

  const initialForm: SAGCourseUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      link: "",
      activity: "",
      state: "draft",
      image: null
    }),
    []
  );
  const [form, setForm] = React.useState<SAGCourseUpsertInput>(initialForm);

  const courseQuery = useQuery({
    queryKey: ["sag-course", courseId],
    queryFn: () => getSAGCourse(String(courseId)),
    enabled: open && mode === "view" && !!courseId
  });

  const activitiesQuery = useQuery({
    queryKey: ["sag-activities"],
    queryFn: () => getSAGActivities({}),
    enabled: open,
    staleTime: 60_000
  });

  const activities = (activitiesQuery.data ?? []) as SAGActivity[];

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
      const c = courseQuery.data as SAGCourse;

      setEditing(false);
      setImageFile(null);
      setImagePreview(c.image ?? null);

      setForm({
        title: c.title ?? "",
        description: c.description ?? "",
        link: c.link ?? "",
        activity: activityId(c),
        state: (c.state ?? "draft") as SAGCourseState,
        image: null
      });
    }
  }, [open, mode, courseQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: createSAGCourse,
    onSuccess: () => {
      toast.success("Course created");
      qc.invalidateQueries({ queryKey: ["sag-courses"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not create course")
  });

  const updateMut = useMutation({
    mutationFn: editSAGCourse,
    onSuccess: () => {
      toast.success("Course updated");
      qc.invalidateQueries({ queryKey: ["sag-course"] });
      qc.invalidateQueries({ queryKey: ["sag-courses"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update course")
  });

  const deleteMut = useMutation({
    mutationFn: deleteSAGCourse,
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["sag-courses"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete course")
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
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.link.trim() ||
      !form.activity
    ) {
      toast.error("Please fill required fields");
      return;
    }

    if (mode === "create") {
      createMut.mutate({ ...form, image: imageFile });
      return;
    }

    if (!courseId) return;
    updateMut.mutate({
      id: courseId,
      data: {
        ...form,
        image: imageFile ?? undefined
      }
    });
  };

  const toggleState = () => {
    if (!courseId) return;
    const current =
      (courseQuery.data as SAGCourse | undefined)?.state ??
      form.state ??
      "draft";
    const next: SAGCourseState =
      current === "published" ? "draft" : "published";

    updateMut.mutate({
      id: courseId,
      data: { state: next }
    });
  };

  const currentState: SAGCourseState =
    ((courseQuery.data as SAGCourse | undefined)?.state as any) ??
    form.state ??
    "draft";

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
              : "View, edit, publish/archive, or delete this course."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
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
                    onClick={toggleState}
                    disabled={updateMut.isPending}
                  >
                    {currentState === "published" ? "Archive" : "Publish"}
                  </Button>

                  {!editing && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex-1 sm:flex-none"
                        >
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
              </div>
            )}

            {/* Image */}
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
                      // eslint-disable-next-line @next/next/no-img-element
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
                  ? "Add Course"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
