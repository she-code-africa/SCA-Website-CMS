"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  addTeamMember,
  editTeamMember,
  getTeamCategories,
  getTeamMember,
  deleteTeamMember
} from "@/features/team/api";
import type { TeamMember, TeamMemberUpsertInput } from "@/features/team/types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  memberId?: string;
  catId?: string;
  defaultCategoryId?: string;
};

export function TeamMemberSheet({
  open,
  onOpenChange,
  mode,
  memberId,
  catId,
  defaultCategoryId
}: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // UI state
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ["team-categories"],
    queryFn: getTeamCategories,
    enabled: open
  });

  const memberQuery = useQuery({
    queryKey: ["team-member", catId, memberId],
    queryFn: () => getTeamMember(String(catId), String(memberId)),
    enabled: open && mode === "view" && !!catId && !!memberId
  });

  const initialForm: TeamMemberUpsertInput = React.useMemo(
    () => ({
      name: "",
      role: "",
      teamCategory: defaultCategoryId ?? "",
      position: 0,
      image: null
    }),
    [defaultCategoryId]
  );

  const [form, setForm] = React.useState<TeamMemberUpsertInput>(initialForm);

  // Reset form when switching between members (prevents flash of stale data)
  React.useEffect(() => {
    if (!open || mode === "create") return;
    setForm(initialForm);
    setImagePreview(null);
    setImageFile(null);
  }, [memberId, catId, open, mode, initialForm]);

  // Populate form when member data arrives
  React.useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (memberQuery.data && !memberQuery.isLoading) {
      const m = memberQuery.data as TeamMember;
      setEditing(false);
      setImageFile(null);
      setImagePreview(m.image ?? null);
      setForm({
        name: m.name ?? "",
        role: m.role ?? "",
        teamCategory:
          typeof m.teamCategory === "string"
            ? m.teamCategory
            : (m.teamCategory?._id ?? ""),
        position: Number(m.position ?? 0),
        isLeader: !!m.isLeader,
        image: null
      });
    }
  }, [open, mode, memberQuery.data, memberQuery.isLoading, initialForm]);

  // Helper: extract server error message
  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as any;
      const data = axiosErr.response?.data;
      if (data?.message) return data.message;
      if (data?.error) return data.error;
    }
    return "An unexpected error occurred";
  };

  // Image handling
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

  // Image compression
  const compressImage = (
    file: File,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
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

  // Mutations
  const createMut = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      toast.success("Member added");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(getErrorMessage(err))
  });

  const updateMut = useMutation({
    mutationFn: editTeamMember,
    onSuccess: () => {
      toast.success("Member updated");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["team-member"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(getErrorMessage(err))
  });

  const deleteMut = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(getErrorMessage(err))
  });

  const submit = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.teamCategory) {
      toast.error("Please fill required fields");
      return;
    }

    let imageValue: string | null | undefined;

    if (imageFile) {
      try {
        imageValue = await compressImage(imageFile, 800, 800, 0.7);
      } catch {
        toast.error("Failed to process image");
        return;
      }
    }

    if (mode === "create") {
      createMut.mutate({ ...form, image: imageValue ?? null });
      return;
    }

    if (!memberId || !catId) return;
    updateMut.mutate({
      id: memberId,
      catId,
      data: { ...form, image: imageValue }
    });
  };

  const saving = createMut.isPending || updateMut.isPending;

  // Skeleton loader for view mode
  if (mode === "view" && memberQuery.isLoading && !memberQuery.data) {
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
            {/* Profile photo skeleton */}
            <div className="grid gap-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Skeleton className="w-32 h-32 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>
            {/* Form fields skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
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
            {mode === "create" ? "Add Member" : "Team Member Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new member to the team."
              : "View, edit, or delete this member."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row (view mode only) */}
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
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete team member?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              if (!memberId || !catId) return;
                              deleteMut.mutate({ catId, id: memberId });
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
                  </PermissionGate>
                )}
              </div>
            )}

            {/* Profile photo */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Profile Photo</label>
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
                        <User className="w-12 h-12 text-muted-foreground" />
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
                    Recommended: Square image, at least 400×400px. Max 5MB.
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

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Role *</label>
                <Input
                  value={form.role}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Team *</label>
                <Select
                  value={form.teamCategory}
                  onValueChange={(v) => setForm({ ...form, teamCategory: v })}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  type="number"
                  value={form.position}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, position: Number(e.target.value) })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Controls the order on the team grid. Lower numbers appear
                  first.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bars */}
        {mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_TEAM}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Add Member"}
              </Button>
            </div>
          </PermissionGate>
        )}

        {mode === "view" && editing && (
          <PermissionGate permission={PERMISSIONS.UPDATE_TEAM}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </PermissionGate>
        )}
      </SheetContent>
    </Sheet>
  );
}
