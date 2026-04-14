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

  const q = useQuery({
    queryKey: ["enquiry", id],
    queryFn: () => getEnquiry(String(id)),
    enabled: open && !!id
  });

  const enquiry = q.data as Enquiry | undefined;

  React.useEffect(() => {
    if (enquiry?.status) setStatus(enquiry.status);
    setEditing(false);
  }, [enquiry, open]);

  const mut = useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string;
      status: EnquiryStatus;
    }) => {
      console.log("🔍 Updating enquiry status:", { id, status });
      return updateEnquiryStatus({ id, status });
    },
// In EnquiryDetailsSheet, onSuccess:
onSuccess: () => {
  toast.success("Enquiry updated");
  qc.invalidateQueries({ queryKey: ["enquiries"] });
  qc.invalidateQueries({ queryKey: ["enquiry", id] });
  qc.refetchQueries({ queryKey: ["enquiries"] });
  onOpenChange(false);
},
    onError: (err: any) => {
      console.error("Update failed:", err);
      toast.error(err?.response?.data?.message || "Failed to update enquiry");
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
                <Badge>{enquiry.status ?? "open"}</Badge>
                <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                  {editing ? "View" : "Edit"}
                </Button>
              </div>

              <Field label="Full Name" value={enquiry.fullName} />
              <Field label="Email" value={enquiry.email} />

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  disabled={!editing}
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

              <div>
                <label className="text-sm font-medium">Message</label>
                <div className="rounded-md border p-3 text-sm bg-muted/50 whitespace-pre-wrap">
                  {enquiry.description ?? "—"}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {editing && (
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => id && mut.mutate({ id, status })}
              disabled={mut.isPending}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {mut.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="rounded-md border p-2 text-sm bg-muted/50">
        {value ?? "—"}
      </div>
    </div>
  );
}
