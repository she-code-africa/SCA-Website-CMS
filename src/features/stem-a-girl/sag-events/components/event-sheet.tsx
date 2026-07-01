"use client";

import * as React from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Calendar } from "lucide-react";
import { toast } from "sonner";

import {
  createSagEvent,
  deleteSagEvent,
  editSagEvent,
  getSagActivities,
  getSagEvent
} from "@/features/stem-a-girl/sag-events/api";
import type {
  SagEvent,
  SagEventUpsertInput
} from "@/features/stem-a-girl/sag-events/types";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  eventId?: string;
};

function toISODateInput(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "yyyy-MM-dd");
}

export function EventSheet({ open, onOpenChange, mode, eventId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: activities = [] } = useQuery({
    queryKey: ["sag-activities"],
    queryFn: getSagActivities,
    enabled: open
  });

  const eventQuery = useQuery({
    queryKey: ["sag-event", eventId],
    queryFn: () => getSagEvent(String(eventId)),
    enabled: open && mode === "view" && !!eventId
  });

  const initialForm: SagEventUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      activity: "",
      link: "",
      eventDate: "", // yyyy-mm-dd (we convert to ISO at submit)
      image: null,
      state: "draft"
    }),
    []
  );

  const [form, setForm] = React.useState<SagEventUpsertInput>(initialForm);

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
      const e = (eventQuery.data as any)?.data?.data ?? eventQuery.data; // supports both shapes
      const ev = e as SagEvent;

      setEditing(false);
      setImageFile(null);
      setImagePreview(ev.image ?? null);

      setForm({
        title: ev.title ?? "",
        description: ev.description ?? "",
        activity:
          typeof ev.activity === "string"
            ? ev.activity
            : (ev.activity?._id ?? ""),
        link: ev.link ?? "",
        eventDate: toISODateInput(ev.eventDate),
        image: null,
        state: (ev.state ?? "draft") as any
      });
    }
  }, [open, mode, eventQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: createSagEvent,
    onSuccess: () => {
      toast.success("Event created");
      qc.invalidateQueries({ queryKey: ["sag-events"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not create event")
  });

  const updateMut = useMutation({
    mutationFn: editSagEvent,
    onSuccess: () => {
      toast.success("Event updated");
      qc.invalidateQueries({ queryKey: ["sag-events"] });
      qc.invalidateQueries({ queryKey: ["sag-event"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update event")
  });

  const deleteMut = useMutation({
    mutationFn: deleteSagEvent,
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["sag-events"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete event")
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

  const submit = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.activity ||
      !form.link.trim() ||
      !form.eventDate
    ) {
      toast.error("Please fill required fields");
      return;
    }

    // convert yyyy-mm-dd to ISO string (midnight UTC-ish; backend typically accepts)
    const iso = new Date(form.eventDate).toISOString();

    if (mode === "create") {
      createMut.mutate({
        ...form,
        eventDate: iso,
        image: imageFile ?? undefined
      });
      return;
    }

    if (!eventId) return;

    updateMut.mutate({
      id: eventId,
      data: {
        ...form,
        eventDate: iso,
        image: imageFile ?? undefined
      }
    });
  };

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
              ? "Create a new event."
              : "View, edit, or delete this event."}
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

                {!editing && (
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
                          onClick={() => eventId && deleteMut.mutate(eventId)}
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
            )}

            {/* Image upload (same style as Team) */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Event Image</label>

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
                    Recommended: Square image, at least 400x400px. Max 5MB.
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

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Link *</label>
                <Input
                  value={form.link}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://…"
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

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Activity *</label>
                <Select
                  value={form.activity}
                  onValueChange={(v) => setForm({ ...form, activity: v })}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
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

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={form.description}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={7}
                  placeholder="Describe the event…"
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
                  ? "Add Event"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
