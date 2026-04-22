// src/features/stem-a-girl/outreach/components/outreach-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import type { Outreach, OutreachUpsertInput } from "../types";
import { createOutreach, deleteOutreach, getOutreach, updateOutreach } from "../api";
import { compressImage } from "../utils";

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
  outreachId?: string;
};

export function OutreachSheet({ open, onOpenChange, mode, outreachId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [newPreviewUrl, setNewPreviewUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const outreachQuery = useQuery({
    queryKey: ["outreach", outreachId],
    queryFn: () => getOutreach(String(outreachId)),
    enabled: open && mode === "view" && !!outreachId
  });

  const initialForm: OutreachUpsertInput = React.useMemo(
    () => ({
      state: "",
      description: "",
      outreachDate: new Date().toISOString().split("T")[0],
      galleryLink: "",
      previewImages: []
    }),
    []
  );

  const [form, setForm] = React.useState<OutreachUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setCoverFile(null);
      setCoverPreview(null);
      setPreviewImages([]);
      return;
    }
    if (outreachQuery.data) {
      const o = outreachQuery.data as Outreach;
      setEditing(false);
      setCoverFile(null);
      setCoverPreview(o.coverImage ?? null);
      setPreviewImages(o.previewImages ?? []);
      setForm({
        state: o.state ?? "",
        description: o.description ?? "",
        outreachDate: o.outreachDate ? new Date(o.outreachDate).toISOString().split("T")[0] : "",
        galleryLink: o.galleryLink ?? "",
        previewImages: o.previewImages ?? []
      });
    }
  }, [open, mode, outreachQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: createOutreach,
    onSuccess: () => {
      toast.success("Outreach created");
      qc.invalidateQueries({ queryKey: ["outreaches"] });
      onOpenChange(false);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Could not create outreach")
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OutreachUpsertInput }) => updateOutreach(id, data),
    onSuccess: () => {
      toast.success("Outreach updated");
      qc.invalidateQueries({ queryKey: ["outreaches"] });
      qc.invalidateQueries({ queryKey: ["outreach", outreachId] });
      onOpenChange(false);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Could not update outreach")
  });

  const deleteMut = useMutation({
    mutationFn: deleteOutreach,
    onSuccess: () => {
      toast.success("Outreach deleted");
      qc.invalidateQueries({ queryKey: ["outreaches"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete outreach")
  });

  const saving = createMut.isPending || updateMut.isPending;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addPreviewImage = () => {
    const url = newPreviewUrl.trim();
    if (url && !previewImages.includes(url)) {
      setPreviewImages([...previewImages, url]);
      setNewPreviewUrl("");
    }
  };

  const removePreviewImage = (url: string) => {
    setPreviewImages(previewImages.filter(u => u !== url));
  };

  const submit = async () => {
    if (!form.state.trim() || !form.description.trim() || !form.outreachDate) {
      toast.error("Please fill required fields");
      return;
    }

    let coverValue: string | undefined = undefined;
    if (coverFile) {
      try {
        coverValue = await compressImage(coverFile, 800, 800, 0.7);
      } catch {
        toast.error("Failed to process cover image");
        return;
      }
    }

    const payload: any = {
      state: form.state.trim(),
      description: form.description.trim(),
      outreachDate: form.outreachDate,
      galleryLink: form.galleryLink?.trim(),
      previewImages
    };
    if (coverValue) payload.coverImage = coverValue;

    if (mode === "create") {
      createMut.mutate(payload);
      return;
    }
    if (!outreachId) return;
    updateMut.mutate({ id: outreachId, data: payload });
  };

  if (mode === "view" && outreachQuery.isLoading && !outreachQuery.data) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
          <VisuallyHidden><SheetTitle>Loading outreach</SheetTitle></VisuallyHidden>
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
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>{mode === "create" ? "Add Outreach" : "Outreach Details"}</SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Share an outreach event."
              : editing ? "Edit outreach details." : "View outreach details. Click Edit to modify."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {mode === "view" && (
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setEditing(v => !v)}>{editing ? "View" : "Edit"}</Button>
                {!editing && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete outreach?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => outreachId && deleteMut.mutate(outreachId)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}

            {/* Cover Image */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div className={cn("w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden",
                    editing ? "border-muted-foreground/25 hover:border-muted-foreground/50" : "border-muted-foreground/25"
                  )}>
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {editing && coverPreview && (
                    <button onClick={handleRemoveCover} className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-xs text-muted-foreground">Recommended: 16:9, max 5MB.</p>
                  {editing && (
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 mr-2" /> Choose Cover
                    </Button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" disabled={!editing} onChange={handleCoverChange} className="hidden" />
                </div>
              </div>
            </div>

            {/* Preview Images */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Preview Images (URLs)</label>
              <div className="space-y-2">
                {previewImages.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs truncate flex-1">{url}</span>
                    {editing && (
                      <button onClick={() => removePreviewImage(url)} className="text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {editing && (
                  <div className="flex gap-2">
                    <Input placeholder="Image URL" value={newPreviewUrl} onChange={e => setNewPreviewUrl(e.target.value)} />
                    <Button type="button" onClick={addPreviewImage}>Add</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Form fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">State *</label>
                <Input value={form.state} disabled={!editing} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Outreach Date *</label>
                <Input type="date" value={form.outreachDate} disabled={!editing} onChange={e => setForm({ ...form, outreachDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Gallery Link</label>
                <Input type="url" value={form.galleryLink} disabled={!editing} onChange={e => setForm({ ...form, galleryLink: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea value={form.description} disabled={!editing} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} />
              </div>
            </div>
          </div>
        </ScrollArea>

        {(mode === "create" || (mode === "view" && editing)) && (
          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
            <Button variant="outline" onClick={() => {
              if (editing && mode === "view") setEditing(false);
              else onOpenChange(false);
            }} disabled={saving}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : mode === "create" ? "Add Outreach" : "Save Changes"}</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}