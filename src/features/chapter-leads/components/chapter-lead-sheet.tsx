"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Upload, X } from "lucide-react";
import {
  addChapterLead,
  editChapterLead,
  getChapterLead,
  deleteChapterLead
} from "@/features/chapters/api";
import type { ChapterLead } from "@/features/chapters/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  leadId?: string;
  chapterId: string;
};

type LeadFormState = {
  name: string;
  role: string;
};

export function ChapterLeadSheet({
  open,
  onOpenChange,
  mode,
  leadId,
  chapterId
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const leadQuery = useQuery({
    queryKey: ["chapter-lead", leadId],
    queryFn: () => getChapterLead(String(leadId)),
    enabled: open && mode === "view" && !!leadId
  });

  const initialForm: LeadFormState = React.useMemo(
    () => ({
      name: "",
      role: ""
    }),
    []
  );

  const [form, setForm] = React.useState<LeadFormState>(initialForm);
  const [socialLinks, setSocialLinks] = React.useState<Record<string, string>>({});
  const [newLinkKey, setNewLinkKey] = React.useState("");
  const [newLinkUrl, setNewLinkUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setSocialLinks({});
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (leadQuery.data) {
      const lead = leadQuery.data as ChapterLead;
      setEditing(false);
      setForm({
        name: lead.name ?? "",
        role: lead.role ?? ""
      });
      setSocialLinks(lead.socialMediaLinks || {});
      setImageFile(null);
      setImagePreview(lead.image ? String(lead.image) : null);
    }
  }, [open, mode, leadQuery.data, initialForm]);

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

  const createMut = useMutation({
    mutationFn: addChapterLead,
    onSuccess: () => {
      toast.success("Lead added");
      qc.invalidateQueries({ queryKey: ["chapter-leads"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add lead")
  });

  const updateMut = useMutation({
    mutationFn: editChapterLead,
    onSuccess: () => {
      toast.success("Lead updated");
      qc.invalidateQueries({ queryKey: ["chapter-leads"] });
      qc.invalidateQueries({ queryKey: ["chapter-lead"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update lead")
  });

  const deleteMut = useMutation({
    mutationFn: deleteChapterLead,
    onSuccess: () => {
      toast.success("Lead deleted");
      qc.invalidateQueries({ queryKey: ["chapter-leads"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete lead")
  });

  const addSocialLink = () => {
    const key = newLinkKey.trim();
    const url = newLinkUrl.trim();
    if (!key || !url) return;
    setSocialLinks((prev) => ({ ...prev, [key]: url }));
    setNewLinkKey("");
    setNewLinkUrl("");
  };

  const removeSocialLink = (key: string) => {
    const { [key]: _removed, ...rest } = socialLinks;
    setSocialLinks(rest);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("chapterId", chapterId);
    formData.append("socialMediaLinks", JSON.stringify(socialLinks));
    if (imageFile) formData.append("image", imageFile);

    if (mode === "create") {
      createMut.mutate(formData as any);
      return;
    }
    if (!leadId) return;
    updateMut.mutate({ id: leadId, data: formData as any });
  };

  const saving = createMut.isPending || updateMut.isPending;
  const canEdit = mode === "create" || editing;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Lead" : "Lead Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new chapter lead."
              : "View, edit, or delete this lead."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_TEAM}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                {!editing && (
                  <PermissionGate permission={PERMISSIONS.DELETE_TEAM}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!leadId) return;
                              deleteMut.mutate(leadId);
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

            {/* Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Profile Photo</label>
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
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {canEdit && imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  disabled={!canEdit}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Role *</label>
                <Input
                  value={form.role}
                  disabled={!canEdit}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g., Chapter Lead, Co-Lead"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid gap-3 pt-2">
              <label className="text-sm font-medium">Social Media Links</label>
              {Object.entries(socialLinks).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(socialLinks).map(([key, url]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                        <span className="font-medium truncate">{key}</span>
                        <span className="truncate text-muted-foreground">{url}</span>
                      </div>
                      {canEdit && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {canEdit && (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <Input
                    placeholder="Platform (e.g., LinkedIn)"
                    value={newLinkKey}
                    onChange={(e) => setNewLinkKey(e.target.value)}
                  />
                  <Input
                    placeholder="Profile URL"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={addSocialLink}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {(mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_TEAM}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Add Lead"}
              </Button>
            </div>
          </PermissionGate>
        )) || (mode === "view" && editing && (
          <PermissionGate permission={PERMISSIONS.UPDATE_TEAM}>
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