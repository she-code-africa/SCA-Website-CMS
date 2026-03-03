"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Upload, X } from "lucide-react";
import {
  addTeamMember,
  archiveTeamMember,
  editTeamMember,
  getTeamCategories,
  getTeamMember,
  publishTeamMember,
  deleteTeamMember
} from "@/features/team/api";
import type { TeamMember, TeamMemberUpsertInput } from "@/features/team/types";

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
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

// ─── RBAC ────────────────────────────────────────────────────────────────────
import { usePermissions } from "@/hooks/usePermissions";

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
  const qc = useQueryClient();

  // ── Permission checks ────────────────────────────────────────────────────
  const { can } = usePermissions();
  const canEdit = can("UPDATE_TEAM");
  const canDelete = can("DELETE_TEAM");

  // ── Local state ──────────────────────────────────────────────────────────
  // If the user can't edit, always start in view mode regardless of `mode`
  const [editing, setEditing] = React.useState(
    mode === "create" ? can("CREATE_TEAM") : false
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  React.useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (memberQuery.data) {
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
  }, [open, mode, memberQuery.data, initialForm]);

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

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      toast.success("Member added");
      qc.invalidateQueries({ queryKey: ["team"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add member")
  });

  const updateMut = useMutation({
    mutationFn: editTeamMember,
    onSuccess: () => {
      toast.success("Member updated");
      qc.invalidateQueries({ queryKey: ["team"] });
      qc.invalidateQueries({ queryKey: ["team-member"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update member")
  });

  const publishMut = useMutation({
    mutationFn: publishTeamMember,
    onSuccess: () => {
      toast.success("Published");
      qc.invalidateQueries({ queryKey: ["team"] });
      qc.invalidateQueries({ queryKey: ["team-member"] });
    },
    onError: () => toast.error("Could not publish")
  });

  const archiveMut = useMutation({
    mutationFn: archiveTeamMember,
    onSuccess: () => {
      toast.success("Archived");
      qc.invalidateQueries({ queryKey: ["team"] });
      qc.invalidateQueries({ queryKey: ["team-member"] });
    },
    onError: () => toast.error("Could not archive")
  });

  const deleteMut = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["team"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.teamCategory) {
      toast.error("Please fill required fields");
      return;
    }
    if (mode === "create") {
      createMut.mutate({ ...form, image: imageFile });
      return;
    }
    if (!memberId || !catId) return;
    updateMut.mutate({
      id: memberId,
      catId,
      data: { ...form, image: imageFile ?? undefined }
    });
  };

  const currentState = (memberQuery.data as TeamMember | undefined)?.state;
  const saving = createMut.isPending || updateMut.isPending;

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
              : "View, edit, publish/archive, or delete this member."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* ── Top actions row (view mode only) ─────────────────────── */}
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Edit toggle — only shown if user can update */}
                {canEdit && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                )}

                <div className="flex gap-2 w-full sm:w-auto">
                  {/* Publish / Archive — only if user can update */}
                  {canEdit && (
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        if (!memberId || !catId) return;
                        if (currentState === "published")
                          archiveMut.mutate({ catId, id: memberId });
                        else publishMut.mutate({ catId, id: memberId });
                      }}
                      disabled={publishMut.isPending || archiveMut.isPending}
                    >
                      {currentState === "published" ? "Archive" : "Publish"}
                    </Button>
                  )}

                  {/* Delete — only if user can delete and is NOT currently editing */}
                  {canDelete && !editing && (
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
                  )}
                </div>
              </div>
            )}

            {/* ── Profile photo ─────────────────────────────────────────── */}
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

            {/* ── Form fields ───────────────────────────────────────────── */}
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
                <label className="text-sm font-medium">Position</label>
                <Input
                  type="number"
                  value={form.position}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, position: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* ── Bottom save bar ─────────────────────────────────────────────
            Shown for:
              create mode  → only if user has CREATE_TEAM
              view + edit  → only if user has UPDATE_TEAM
        ──────────────────────────────────────────────────────────────── */}
        {mode === "create" && can("CREATE_TEAM") && (
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
        )}

        {mode === "view" && editing && canEdit && (
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
        )}
      </SheetContent>
    </Sheet>
  );
}