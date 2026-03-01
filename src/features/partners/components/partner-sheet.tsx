// src/features/partners/components/partner-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Upload, X } from "lucide-react";
import {
  addPartner,
  editPartner,
  getPartner,
  deletePartner
} from "@/features/partners/api";
import type { Partner, PartnerUpsertInput } from "@/features/partners/types";

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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  partnerId?: string;
};

export function PartnerSheet({ open, onOpenChange, mode, partnerId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const partnerQuery = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartner(String(partnerId)),
    enabled: open && mode === "view" && !!partnerId
  });

  const initialForm: PartnerUpsertInput = React.useMemo(
    () => ({
      name: "",
      featured: false,
      image: null
    }),
    []
  );

  const [form, setForm] = React.useState<PartnerUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (partnerQuery.data) {
      const p = partnerQuery.data as Partner;
      setEditing(false);
      setImageFile(null);

      // Set existing image preview if available
      if (p.image) {
        setImagePreview(p.image);
      } else {
        setImagePreview(null);
      }

      setForm({
        name: p.name ?? "",
        featured: p.featured ?? false,
        image: null
      });
    }
  }, [open, mode, partnerQuery.data, initialForm]);

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
    mutationFn: addPartner,
    onSuccess: () => {
      toast.success("Partner added");
      qc.invalidateQueries({ queryKey: ["partners"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add partner")
  });

  const updateMut = useMutation({
    mutationFn: editPartner,
    onSuccess: () => {
      toast.success("Partner updated");
      qc.invalidateQueries({ queryKey: ["partners"] });
      qc.invalidateQueries({ queryKey: ["partner"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update partner")
  });

  const deleteMut = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["partners"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (mode === "create") {
      createMut.mutate({ ...form, image: imageFile });
      return;
    }

    if (!partnerId) return;
    updateMut.mutate({
      id: partnerId,
      data: { ...form, image: imageFile ?? undefined }
    });
  };

  const saving = createMut.isPending || updateMut.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Partner" : "Partner Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new partner."
              : "View, edit, or delete this partner."}
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

                {/* Delete with confirmation */}
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
                        <AlertDialogTitle>Delete partner?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (!partnerId) return;
                            deleteMut.mutate(partnerId);
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
            )}

            {/* Partner Logo Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Partner Logo</label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Image Preview */}
                <div className="relative group">
                  <div
                    className={cn(
                      "w-24 h-24 rounded-full border-2 border-dashed overflow-hidden transition-colors",
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
                        <Building2 className="w-8 h-8 text-muted-foreground" />
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
                      Recommended: Square logo, at least 200x200px. Max 2MB.
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
                      Choose Logo
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
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Company Name *</label>
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Partner Company Name"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Featured Partner</p>
                  <p className="text-xs text-muted-foreground">
                    Display this partner prominently on the website
                  </p>
                </div>
                <Switch
                  checked={form.featured}
                  disabled={!editing}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar - Fixed */}
        {(mode === "create" || editing) && (
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
              onClick={submit}
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Add Partner"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
