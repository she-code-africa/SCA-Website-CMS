// src/features/events/components/event-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Upload, X, Loader2 } from "lucide-react";
import {
  addEvent,
  editEvent,
  deleteEvent,
  getEvent,
  publishEvent, // <-- new
  archiveEvent, // <-- new
} from "@/features/events/api";
import type { Event, EventUpsertInput } from "@/features/events/types";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  eventId?: string;
  onUpdate?: () => Promise<void>; // <-- new
};

// Image compression helper (unchanged)
const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7,
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

export function EventSheet({
  open,
  onOpenChange,
  mode,
  eventId,
  onUpdate,
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isState, setIsState] = React.useState(false);
  const [eventsState, setEventsState] = React.useState("");

  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(String(eventId)),
    enabled: open && mode === "view" && !!eventId,
  });

  const event = eventQuery.data as Event | undefined;

  const initialForm: EventUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      link: "",
      eventDate: format(new Date(), "yyyy-MM-dd"),
      image: null,
    }),
    [],
  );

  const [form, setForm] = React.useState<EventUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (event) {
      setEditing(false);
      setImageFile(null);
      setImagePreview(event.image ?? null);
      setEventsState(event.state ?? "");
      setForm({
        title: event.title ?? "",
        description: event.description ?? "",
        link: event.link ?? "",
        eventDate: event.eventDate
          ? format(new Date(event.eventDate), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        image: null,
      });
    }
  }, [open, mode, event, initialForm]);

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

  const createMut = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      link: string;
      eventDate: string;
      image?: string | null;
    }) => addEvent(data),
    onSuccess: async () => {
      toast.success("Event added");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["events"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not add event");
    },
  });

  const updateMut = useMutation({
    mutationFn: async (payload: {
      id: string;
      data: {
        title?: string;
        description?: string;
        link?: string;
        eventDate?: string;
        image?: string | null;
        //
        state?: string;
        published?: Date;
      };
    }) => editEvent(payload),
    onSuccess: async () => {
      toast.success("Event updated");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Could not update event");
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteEvent,
    onSuccess: async () => {
      toast.success("Deleted");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["events"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete"),
  });

  // Publish mutation
  const publishMut = useMutation({
    mutationFn: (id: string) => publishEvent(id),
    onSuccess: async () => {
      toast.success("Event published");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event"] });
    },
    onError: () => toast.error("Could not publish event"),
  });

  // Archive mutation
  const archiveMut = useMutation({
    mutationFn: (id: string) => archiveEvent(id),
    onSuccess: async () => {
      toast.success("Event archived");
      await onUpdate?.();
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event"] });
    },
    onError: () => toast.error("Could not archive event"),
  });

  // const submit = async () => {
  //   if (
  //     !form.title.trim() ||
  //     !form.description.trim() ||
  //     !form.link.trim() ||
  //     !form.eventDate
  //   ) {
  //     toast.error("Please fill all required fields");
  //     return;
  //   }

  //   try {
  //     new URL(form.link);
  //   } catch {
  //     toast.error("Please enter a valid URL");
  //     return;
  //   }

  //   let imageValue: string | null | undefined = undefined;

  //   if (imageFile) {
  //     try {
  //       imageValue = await compressImage(imageFile, 800, 800, 0.7);
  //     } catch {
  //       toast.error("Failed to process image");
  //       return;
  //     }
  //   }

  //   if (mode === "create") {
  //     createMut.mutate({
  //       title: form.title.trim(),
  //       description: form.description.trim(),
  //       link: form.link.trim(),
  //       eventDate: form.eventDate,
  //       image: imageValue ?? null,
  //     });
  //     return;
  //   }

  //   if (!eventId) return;

  //   if (isState) {
  //     updateMut.mutate({
  //       id: eventId,
  //       data: {
  //         title: form.title.trim(),
  //         description: form.description.trim(),
  //         link: form.link.trim(),
  //         eventDate: form.eventDate,
  //         image: imageValue,
  //         //
  //         state: eventsState,
  //         published: new Date(),
  //       },
  //     });
  //   } else {
  //     updateMut.mutate({
  //       id: eventId,
  //       data: {
  //         title: form.title.trim(),
  //         description: form.description.trim(),
  //         link: form.link.trim(),
  //         eventDate: form.eventDate,
  //         image: imageValue,
  //         //
  //       },
  //     });
  //   }

  //   setIsState(false);
  // };

  const submit = async (statePayload?: { state: string; published: Date }) => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.link.trim() ||
      !form.eventDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      new URL(form.link);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    let imageValue: string | null | undefined = undefined;

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
        title: form.title.trim(),
        description: form.description.trim(),
        link: form.link.trim(),
        eventDate: form.eventDate,
        image: imageValue ?? null,
      });
      return;
    }

    if (!eventId) return;

    updateMut.mutate({
      id: eventId,
      data: {
        title: form.title.trim(),
        description: form.description.trim(),
        link: form.link.trim(),
        eventDate: form.eventDate,
        image: imageValue,
        ...(statePayload ?? {}),
      },
    });
  };

  const saving = createMut.isPending || updateMut.isPending;
  const currentState = event?.state;

  // Skeleton loader while fetching event detail
  if (mode === "view" && eventQuery.isLoading && !event) {
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
            {mode === "create" ? "Add Event" : "Event Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new event."
              : "View, edit, publish, or delete this event."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row (view mode only) */}
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

                <div className="flex gap-2">
                  {/* Publish / Archive button */}
                  {!editing && (
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
                          // const newState =
                          //   currentState === "published"
                          //     ? "archived"
                          //     : "published";
                          // submit({ state: newState, published: new Date() });
                        }}
                        disabled={publishMut.isPending || archiveMut.isPending}
                      >
                        {currentState === "published" ? "Archive" : "Publish"}
                      </Button>
                    </PermissionGate>
                  )}

                  {/* Delete button – only when NOT editing */}
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
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                              )}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PermissionGate>
                  )}
                </div>
              </div>
            )}

            {/* Event Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Event Image</label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      editing
                        ? "border-muted-foreground/25 hover:border-muted-foreground/50"
                        : "border-muted-foreground/25",
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
                    Recommended: 16:9 aspect ratio, at least 800x450px. Max 5MB.
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

                  {editing && (
                    <p className="text-xs text-muted-foreground">
                      {imageFile
                        ? `Selected: ${imageFile.name}`
                        : mode === "create"
                          ? "No image selected (optional)"
                          : "No new file selected (keeps existing image)."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event Title"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Event Date *</label>
                <Input
                  type="date"
                  value={form.eventDate}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Link *</label>
                <Input
                  type="url"
                  value={form.link}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://example.com/event"
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
                  rows={8}
                  placeholder="Describe the event..."
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_EVENT}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => submit()}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Add Event"
                )}
              </Button>
            </div>
          </PermissionGate>
        )}

        {mode === "view" && editing && (
          <PermissionGate permission={PERMISSIONS.UPDATE_EVENT}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => submit()}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </PermissionGate>
        )}
      </SheetContent>
    </Sheet>
  );
}
