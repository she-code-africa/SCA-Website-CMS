"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Image as ImageIcon, FileText, Video } from "lucide-react";
import {
  createMedia,
  editMedia,
  getMedia,
  deleteMedia
} from "@/features/media/api";
import type { Media, MediaUpsertInput } from "@/features/media/types";

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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  mediaId?: string;
};

export function MediaSheet({ open, onOpenChange, mode, mediaId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  
  // Cover image state
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = React.useState<string | null>(null);
  const coverFileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Gallery images state (mix of URLs and new Files)
  const [galleryImages, setGalleryImages] = React.useState<(File | string)[]>([]);
  const galleryFileInputRef = React.useRef<HTMLInputElement>(null);

  const mediaQuery = useQuery({
    queryKey: ["media", mediaId],
    queryFn: () => getMedia(String(mediaId)),
    enabled: open && mode === "view" && !!mediaId
  });

  const initialForm: MediaUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      type: "blog",
      author: "",
      tag: "",
      link: "",
      dateCreated: "",
      coverImage: null,
      images: []
    }),
    []
  );

  const [form, setForm] = React.useState<MediaUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setCoverImageFile(null);
      setCoverImagePreview(null);
      setGalleryImages([]);
      return;
    }

    if (mediaQuery.data) {
      const m = mediaQuery.data as Media;
      setEditing(false);
      setCoverImageFile(null);
      
      // Set existing cover image preview
      if (m.coverImage) {
        setCoverImagePreview(m.coverImage);
      } else {
        setCoverImagePreview(null);
      }
      
      // Set existing gallery images
      setGalleryImages(m.images || []);

      setForm({
        title: m.title ?? "",
        description: m.description ?? "",
        type: m.type ?? "blog",
        author: m.author ?? "",
        tag: m.tag ?? "",
        link: m.link || m.videoLink || m.blogLink || "",
        dateCreated: m.dateCreated ? m.dateCreated.split("T")[0] : "",
        coverImage: null,
        images: m.images || []
      });
    }
  }, [open, mode, mediaQuery.data, initialForm]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = "";
    }
  };

  const handleGalleryImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    setGalleryImages((prev) => [...prev, ...uploadedFiles]);
  };

  const handleDeleteGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getImagePreviewUrl = (image: File | string): string => {
    if (typeof image === "string") {
      return image; // Existing URL
    } else if (image instanceof File) {
      return URL.createObjectURL(image); // New file
    }
    return "";
  };

  const createMut = useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      toast.success("Media created");
      qc.invalidateQueries({ queryKey: ["media"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not create media")
  });

  const updateMut = useMutation({
    mutationFn: editMedia,
    onSuccess: () => {
      toast.success("Media updated");
      qc.invalidateQueries({ queryKey: ["media"] });
      qc.invalidateQueries({ queryKey: ["media", mediaId] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update media")
  });

  const deleteMut = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["media"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.type ||
      !form.author.trim() ||
      !form.tag.trim() ||
      !form.link.trim() ||
      !form.dateCreated
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (mode === "create") {
      createMut.mutate({
        ...form,
        coverImage: coverImageFile,
        images: galleryImages
      });
      return;
    }

    if (!mediaId) return;
    updateMut.mutate({
      id: mediaId,
      data: {
        ...form,
        coverImage: coverImageFile ?? undefined,
        images: galleryImages
      }
    });
  };

  const saving = createMut.isPending || updateMut.isPending;
  const showGallery = form.type === "image";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Media" : "Media Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add new media content."
              : "View, edit, or delete this media."}
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
                          <AlertDialogTitle>Delete media?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!mediaId) return;
                              deleteMut.mutate(mediaId);
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

            {/* Cover Image Upload */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Cover Image *</label>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      editing
                        ? "border-muted-foreground/25 hover:border-muted-foreground/50"
                        : "border-muted-foreground/25"
                    )}
                  >
                    {coverImagePreview ? (
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {editing && coverImagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveCoverImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                      onClick={() => coverFileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Cover Image
                    </Button>
                  )}

                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={!editing}
                    onChange={handleCoverImageChange}
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
                  placeholder="Media title"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Type *</label>
                <Select
                  value={form.type}
                  onValueChange={(v: any) => setForm({ ...form, type: v })}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Author *</label>
                <Input
                  value={form.author}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Tag *</label>
                <Input
                  value={form.tag}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Media tag"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Date Created *</label>
                <Input
                  type="date"
                  value={form.dateCreated}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, dateCreated: e.target.value })
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
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={form.description}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                placeholder="Media description..."
              />
            </div>

            {/* Gallery Images (only for image type) */}
            {showGallery && (
              <div className="grid gap-3">
                <label className="text-sm font-medium">Gallery Images</label>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImagePreviewUrl(image)}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        
                        {editing && (
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(index)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="text-xs">
                            {typeof image === "string" ? "Existing" : "New"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {editing && (
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => galleryFileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Images
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {galleryImages.length} image{galleryImages.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={!editing}
                  onChange={handleGalleryImagesUpload}
                  className="hidden"
                />
              </div>
            )}
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
                  ? "Add Media"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}