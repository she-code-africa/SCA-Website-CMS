// src/features/stem-a-girl/enquiries/components/stem-enquiry-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import type {
  StemEnquiry,
  StemEnquiryUpsertInput,
  EnquiryStatus
} from "../types";
import { getStemEnquiry, updateStemEnquiry, deleteStemEnquiry } from "../api";

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
// import { cn } from "@/lib/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
  mode: "view"; // only view/edit; create is not used (enquiries come from public form)
  enquiryId?: string;
};

export function StemEnquirySheet({
  open,
  onOpenChange,
  // mode,
  enquiryId
}: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);

  const enquiryQuery = useQuery({
    queryKey: ["stem-enquiry", enquiryId],
    queryFn: () => getStemEnquiry(String(enquiryId)),
    enabled: open && !!enquiryId
  });

  const [form, setForm] = React.useState<StemEnquiryUpsertInput>({
    fullName: "",
    email: "",
    subject: "",
    description: "",
    message: "",
    status: "open",
    comment: ""
  });

  React.useEffect(() => {
    if (!open || !enquiryQuery.data) return;
    const e = enquiryQuery.data as StemEnquiry;
    setEditing(false);
    setForm({
      fullName: e.fullName ?? "",
      email: e.email ?? "",
      subject: e.subject ?? "",
      description: e.description ?? "",
      message: e.message ?? "",
      status: e.status ?? "open",
      comment: e.comment ?? ""
    });
  }, [open, enquiryQuery.data]);

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StemEnquiryUpsertInput }) =>
      updateStemEnquiry(id, data),
    onSuccess: () => {
      toast.success("Enquiry updated");
      qc.invalidateQueries({ queryKey: ["stem-enquiries"] });
      qc.invalidateQueries({ queryKey: ["stem-enquiry", enquiryId] });
      setEditing(false);
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update enquiry")
  });

  const deleteMut = useMutation({
    mutationFn: deleteStemEnquiry,
    onSuccess: () => {
      toast.success("Enquiry deleted");
      qc.invalidateQueries({ queryKey: ["stem-enquiries"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete enquiry")
  });

  const saving = updateMut.isPending;

  const submit = () => {
    if (!enquiryId) return;
    updateMut.mutate({ id: enquiryId, data: form });
  };

  if (enquiryQuery.isLoading && !enquiryQuery.data) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col"
        >
          <VisuallyHidden>
            <SheetTitle>Loading enquiry</SheetTitle>
          </VisuallyHidden>
          <SheetHeader className="px-6 py-4 border-b">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </SheetHeader>
          <div className="flex-1 px-6 py-6 space-y-6">
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
          <SheetTitle>Enquiry Details</SheetTitle>
          <SheetDescription>
            {editing
              ? "Edit the enquiry status and comment."
              : "View enquiry details. Click Edit to modify."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                {editing ? "View" : "Edit"}
              </Button>
              {!editing && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => enquiryId && deleteMut.mutate(enquiryId)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={form.fullName} disabled />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={form.email} disabled />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Subject</label>
                <Input value={form.subject} disabled />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} disabled rows={4} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Message (optional)
                </label>
                <Textarea value={form.message || ""} disabled rows={3} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  disabled={!editing}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as EnquiryStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Comment (admin note)
                </label>
                <Textarea
                  value={form.comment || ""}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {editing && (
          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
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
