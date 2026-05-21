"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Calendar } from "lucide-react";
import {
  addChapterEvent,
  editChapterEvent,
  getChapterEvent,
  deleteChapterEvent
} from "@/features/chapters/api";
import type { ChapterEvent } from "@/features/chapters/types";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  eventId?: string;
  chapterId: string;
};

type EventFormState = {
  title: string;
  description: string;
  link: string;
  eventDate: string;
};

export function ChapterEventSheet({
  open,
  onOpenChange,
  mode,
  eventId,
  chapterId
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  // ---------- Multi‑image state ----------
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const eventQuery = useQuery({
    queryKey: ["chapter-event", eventId],
    queryFn: () => getChapterEvent(String(eventId)),
    enabled: open && mode === "view" && !!eventId
  });

  const initialForm: EventFormState = React.useMemo(
    () => ({
      title: "",
      description: "",
      link: "",
      eventDate: new Date().toISOString().split("T")[0]
    }),
    []
  );

  const [form, setForm] = React.useState<EventFormState>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFiles([]);
      setImagePreviews([]);
      return;
    }

    if (eventQuery.data) {
      const ev = eventQuery.data as ChapterEvent;
      setEditing(false);

      setForm({
        title: ev.title ?? "",
        description: ev.description ?? "",
        link: ev.link ?? "",
        eventDate: ev.eventDate
          ? new Date(ev.eventDate).toISOString().split("T")[0]
          : ""
      });

      // Existing images are URLs – show them as previews, no File objects
      const existingImages = (ev.images ?? []).filter(Boolean) as string[];
      setImagePreviews(existingImages);
      setImageFiles([]); // no new files yet
    }
  }, [open, mode, eventQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: addChapterEvent,
    onSuccess: () => {
      toast.success("Event added");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not add event")
  });

  const updateMut = useMutation({
    mutationFn: editChapterEvent,
    onSuccess: () => {
      toast.success("Event updated");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      qc.invalidateQueries({ queryKey: ["chapter-event"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update event")
  });

  const deleteMut = useMutation({
    mutationFn: deleteChapterEvent,
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete event")
  });

  // ---------- Image handlers ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const newPreviews: string[] = [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        // Once all previews are generated, update state
        if (newPreviews.length === newFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...newFiles]);

    // Reset input so the same files can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    // Remove preview and file at the given index
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Submit using FormData ----------
  const submit = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.link.trim() ||
      !form.eventDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("link", form.link.trim());
    fd.append("eventDate", form.eventDate);
    fd.append("chapterId", chapterId);

    // Append each new file. Existing images (URLs) are not re‑uploaded unless replaced.
    imageFiles.forEach((file) => {
      fd.append("images", file);
    });

    if (mode === "create") {
      createMut.mutate(fd as any);
      return;
    }

    if (!eventId) return;
    updateMut.mutate({ id: eventId, data: fd as any });
  };

  const saving = createMut.isPending || updateMut.isPending;

  // Skeleton loader while fetching
  if (mode === "view" && eventQuery.isLoading && !eventQuery.data) {
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
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const canEdit = mode === "create" || editing;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Event" : "Event Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new chapter event."
              : editing
                ? "Edit the event details."
                : "View event details. Click Edit to modify."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_EVENT}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                {!editing && (
                  <PermissionGate permission={PERMISSIONS.DELETE_EVENT}>
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
                          <AlertDialogTitle>Delete event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!eventId) return;
                              deleteMut.mutate(eventId);
                            }}
                            className={cn(
                              "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            )}
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

            {/* ---------- Image Upload Section (Multi) ---------- */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">
                Event Image(s){" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>{" "}
              <div className="space-y-3">
                {/* Previews grid */}
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <div
                        className={cn(
                          "w-24 h-24 rounded-lg border-2 border-dashed overflow-hidden",
                          canEdit
                            ? "border-muted-foreground/25 hover:border-muted-foreground/50"
                            : "border-muted-foreground/25"
                        )}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Add more button / placeholder */}
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Add</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Recommended: Square images, at least 400x400px. Max 5MB each.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={!canEdit}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  disabled={!canEdit}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event Title"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={form.description}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Event description..."
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Event Link *</label>
                <Input
                  type="url"
                  value={form.link}
                  disabled={!canEdit}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://event-link.com"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Event Date *</label>
                <Input
                  type="date"
                  value={form.eventDate}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {(mode === "create" || (mode === "view" && editing)) && (
          <PermissionGate
            permission={
              mode === "create"
                ? PERMISSIONS.CREATE_EVENT
                : PERMISSIONS.UPDATE_EVENT
            }
          >
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
              <Button variant="default" onClick={submit} disabled={saving}>
                {saving
                  ? "Saving…"
                  : mode === "create"
                    ? "Add Event"
                    : "Save Changes"}
              </Button>
            </div>
          </PermissionGate>
        )}
      </SheetContent>
    </Sheet>
  );
}
