// src/features/stem-a-girl/impact-stories/components/impact-story-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import type {
  ImpactStory,
  ImpactStoryState,
  ImpactStoryUpsertInput
} from "../types";
import {
  createImpactStory,
  deleteImpactStory,
  getImpactStory,
  updateImpactStory
} from "../api";
import { getSAGSchools } from "@/features/stem-a-girl/schools/api";
import type { SAGSchool } from "@/features/stem-a-girl/schools/types";
import { compressImage, getSchoolId } from "../utils";

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
// import { Switch } from "@/components/ui/switch";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  storyId?: string;
};

export function ImpactStorySheet({ open, onOpenChange, mode, storyId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const storyQuery = useQuery({
    queryKey: ["impact-story", storyId],
    queryFn: () => getImpactStory(String(storyId)),
    enabled: open && mode === "view" && !!storyId
  });

  const schoolsQuery = useQuery({
    queryKey: ["sag-schools"],
    queryFn: () => getSAGSchools({}),
    enabled: open,
    staleTime: 60_000
  });

  const schools = (schoolsQuery.data ?? []) as SAGSchool[];

  const initialForm: ImpactStoryUpsertInput = React.useMemo(
    () => ({
      name: "",
      story: "",
      school: "",
      state: "draft"
    }),
    []
  );

  const [form, setForm] = React.useState<ImpactStoryUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (storyQuery.data) {
      const s = storyQuery.data as ImpactStory;
      setEditing(false);
      setImageFile(null);
      setImagePreview(s.image ?? null);
      setForm({
        name: s.name ?? "",
        story: s.story ?? "",
        school: getSchoolId(s),
        state: (s.state ?? "draft") as ImpactStoryState
      });
    }
  }, [open, mode, storyQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: createImpactStory,
    onSuccess: () => {
      toast.success("Impact story created");
      qc.invalidateQueries({ queryKey: ["impact-stories"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Could not create impact story"
      )
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ImpactStoryUpsertInput }) =>
      updateImpactStory(id, data),
    onSuccess: () => {
      toast.success("Impact story updated");
      qc.invalidateQueries({ queryKey: ["impact-stories"] });
      qc.invalidateQueries({ queryKey: ["impact-story", storyId] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Could not update impact story"
      )
  });

  const deleteMut = useMutation({
    mutationFn: deleteImpactStory,
    onSuccess: () => {
      toast.success("Impact story deleted");
      qc.invalidateQueries({ queryKey: ["impact-stories"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete impact story")
  });

  const saving = createMut.isPending || updateMut.isPending;

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

  const submit = async () => {
    if (!form.name.trim() || !form.story.trim() || !form.school) {
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
      name: form.name.trim(),
      story: form.story.trim(),
      school: form.school,
      state: form.state
    };
    if (imageValue) payload.image = imageValue;

    if (mode === "create") {
      createMut.mutate(payload);
      return;
    }
    if (!storyId) return;
    updateMut.mutate({ id: storyId, data: payload });
  };

  if (mode === "view" && storyQuery.isLoading && !storyQuery.data) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col"
        >
          <VisuallyHidden>
            <SheetTitle>Loading impact story</SheetTitle>
          </VisuallyHidden>
          <SheetHeader className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </SheetHeader>
          <div className="flex-1 px-6 py-6 space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
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
            {mode === "create" ? "Add Impact Story" : "Impact Story Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Share a success story from a girl in the program."
              : editing
                ? "Edit the story details."
                : "View story details. Click Edit to modify."}
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
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete story?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => storyId && deleteMut.mutate(storyId)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}

            <div className="grid gap-3">
              <label className="text-sm font-medium">Story Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden",
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
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white"
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

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Story *</label>
                <Textarea
                  value={form.story}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, story: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <label className="text-sm font-medium">State</label>
                <Select
                  value={form.state}
                  onValueChange={(v) =>
                    setForm({ ...form, state: v as ImpactStoryState })
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

        {(mode === "create" || (mode === "view" && editing)) && (
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
            <Button onClick={submit} disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Add Story"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
