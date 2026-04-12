"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Archive, FileCheck, X, Calendar } from "lucide-react";
import {
  addChapterEvent,
  editChapterEvent,
  getChapterEvent,
  publishChapterEvent,
  archiveChapterEvent,
  deleteChapterEvent
} from "@/features/chapters/api";
import type { ChapterEvent } from "@/features/chapters/types";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

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
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
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
      setImageFile(null);
      setImagePreview(null);
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

      setImageFile(null);
      setImagePreview(ev.images?.[0] ? String(ev.images[0]) : null);
    }
  }, [open, mode, eventQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: addChapterEvent,
    onSuccess: () => {
      toast.success("Event added");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add event")
  });

  const updateMut = useMutation({
    mutationFn: editChapterEvent,
    onSuccess: () => {
      toast.success("Event updated");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      qc.invalidateQueries({ queryKey: ["chapter-event"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update event")
  });

  const publishMut = useMutation({
    mutationFn: publishChapterEvent,
    onSuccess: () => {
      toast.success("Event published");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      qc.invalidateQueries({ queryKey: ["chapter-event"] });
    },
    onError: () => toast.error("Could not publish event")
  });

  const archiveMut = useMutation({
    mutationFn: archiveChapterEvent,
    onSuccess: () => {
      toast.success("Event archived");
      qc.invalidateQueries({ queryKey: ["chapter-events"] });
      qc.invalidateQueries({ queryKey: ["chapter-event"] });
    },
    onError: () => toast.error("Could not archive event")
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

  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.link.trim() ||
      !form.eventDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    formData.append("eventDate", form.eventDate);
    formData.append("chapterId", chapterId);

    if (imageFile) {
      formData.append("images", imageFile);
    }

    if (mode === "create") {
      createMut.mutate(formData as any);
      return;
    }

    if (!eventId) return;
    updateMut.mutate({ id: eventId, data: formData as any });
  };

  const currentState = (eventQuery.data as ChapterEvent | undefined)
    ?.eventState;
  const saving = createMut.isPending || updateMut.isPending;
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
              : "View, edit, publish/archive, or delete this event."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
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

                <div className="flex gap-2 w-full sm:w-auto">
                  <PermissionGate permission={PERMISSIONS.UPDATE_EVENT}>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        if (!eventId) return;
                        if (currentState === "published") {
                          archiveMut.mutate(eventId);
                        } else {
                          publishMut.mutate(eventId);
                        }
                      }}
                      disabled={publishMut.isPending || archiveMut.isPending}
                    >
                      {currentState === "published" ? (
                        <>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </>
                      ) : (
                        <>
                          <FileCheck className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </Button>
                  </PermissionGate>

                  {!editing && (
                    <PermissionGate permission={PERMISSIONS.DELETE_EVENT}>
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
              </div>
            )}

            {/* Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Event Image</label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      canEdit
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
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {canEdit && imagePreview && (
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
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 400x400px. Max 5MB.
                    </p>
                  </div>

                  {canEdit && (
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
                    disabled={!canEdit}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
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

        {/* Bottom action bar */}
        {(mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_EVENT}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Add Event"}
              </Button>
            </div>
          </PermissionGate>
        )) ||
          (mode === "view" && editing && (
            <PermissionGate permission={PERMISSIONS.UPDATE_EVENT}>
              <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={submit} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </PermissionGate>
          ))}
      </SheetContent>
    </Sheet>
  );
}
