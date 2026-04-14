"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEnquiry, updateEnquiryStatus } from "../api";
import type { Enquiry, EnquiryStatus } from "../types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { toast } from "sonner";

export function EnquiryDetailsSheet({
  open,
  onOpenChange,
  id
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string | null;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);
  const [status, setStatus] = React.useState<EnquiryStatus>("open");
  const [comment, setComment] = React.useState("");

  const q = useQuery({
    queryKey: ["enquiry", id],
    queryFn: () => getEnquiry(String(id)),
    enabled: open && !!id
  });

  const enquiry = q.data as Enquiry | undefined;

  React.useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status ?? "open");
      setComment(enquiry.comment ?? "");
    }
    setEditing(false);
  }, [enquiry, open]);

  const mut = useMutation({
    mutationFn: ({
      id,
      status,
      comment
    }: {
      id: string;
      status: EnquiryStatus;
      comment?: string;
    }) => updateEnquiryStatus({ id, status, comment }),
    onSuccess: () => {
      toast.success("Enquiry updated");
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      qc.invalidateQueries({ queryKey: ["enquiry", id] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to update enquiry";
      toast.error(message);
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Enquiry Details</SheetTitle>
          <SheetDescription>View and manage enquiry status.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-6">
          {q.isLoading ? (
            <div className="space-y-6">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ) : !enquiry ? (
            <p className="text-sm text-red-500">Failed to load enquiry.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between">
                <Badge variant={status === "closed" ? "secondary" : "default"}>
                  {status}
                </Badge>
                <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "View" : "Edit"}
                </Button>
              </div>

              <Field label="Full Name" value={enquiry.fullName} />
              <Field label="Email" value={enquiry.email} />
              <Field label="Message" value={enquiry.description} multiline />

              {editing ? (
                <>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={status}
                      onValueChange={(v) => setStatus(v as EnquiryStatus)}
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
                      Comment (optional)
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a note about this enquiry..."
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Field label="Status" value={status} />
                  {comment && (
                    <Field label="Comment" value={comment} multiline />
                  )}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {editing && (
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                id && mut.mutate({ id, status, comment: comment || undefined })
              }
              disabled={mut.isPending}
            >
              {mut.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  value,
  multiline = false
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {multiline ? (
        <div className="rounded-md border p-3 text-sm bg-muted/50 whitespace-pre-wrap">
          {value ?? "—"}
        </div>
      ) : (
        <div className="rounded-md border p-2 text-sm bg-muted/50">
          {value ?? "—"}
        </div>
      )}
    </div>
  );
}
