"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  VolunteerRequest,
  VolunteerStatus
} from "@/features/volunteer-requests/types";
import {
  getVolunteerRequest,
  updateVolunteerStatusWithReason
} from "@/features/volunteer-requests/api";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string | null;
};

type StatusUpdateDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  status: VolunteerStatus;
  onSubmit: (reason?: string) => void;
  isPending: boolean;
};

function StatusUpdateDialog({
  open,
  onOpenChange,
  status,
  onSubmit,
  isPending
}: StatusUpdateDialogProps) {
  const [reason, setReason] = React.useState("");
  const isReject = status === "Rejected";

  const handleSubmit = () => {
    if (isReject && !reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onSubmit(isReject ? reason : reason || undefined);
    setReason("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === "Approved" && "Approve volunteer request"}
            {status === "Pending" && "Mark as pending"}
            {status === "Rejected" && "Reject volunteer request"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {status === "Rejected"
              ? "Please provide a reason for rejection. This will be shared with the applicant."
              : "You may optionally add a note (for internal reference)."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          placeholder={
            status === "Rejected"
              ? "Reason for rejection..."
              : "Optional note..."
          }
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-24"
          autoFocus
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isPending}
            className={
              status === "Rejected" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function statusBadgeVariant(status?: VolunteerStatus) {
  if (status === "Approved") return "default";
  if (status === "Rejected") return "destructive";
  return "secondary";
}

export function VolunteerDetailsSheet({ open, onOpenChange, id }: Props) {
  const qc = useQueryClient();
  const [statusDialog, setStatusDialog] = React.useState<{
    open: boolean;
    status: VolunteerStatus;
  }>({ open: false, status: "Pending" });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["volunteer", id],
    queryFn: () => getVolunteerRequest(String(id)),
    enabled: open && !!id
  });

  const volunteer = data as VolunteerRequest | undefined;

  React.useEffect(() => {
    if (!open) {
      setStatusDialog({ open: false, status: "Pending" });
    }
  }, [open]);


const updateMut = useMutation({
  mutationFn: ({
    status,
    reason
  }: {
    status: VolunteerStatus;
    reason?: string;
  }) => updateVolunteerStatusWithReason({ id: String(id), status, reason }),
  onSuccess: () => {
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["volunteers"] });
    qc.invalidateQueries({ queryKey: ["volunteer"] });
    refetch();
  },
  onError: (err: any) => {
    const message = err?.response?.data?.message;

    // Backend updates status but email fails
    if (message === "No recipients defined") {
      toast.warning(
        "Status updated, but email notification failed (no recipient)."
      );
      // Refresh to show the updated status
      qc.invalidateQueries({ queryKey: ["volunteers"] });
      qc.invalidateQueries({ queryKey: ["volunteer"] });
      refetch();
    } else {
      toast.error(message || "Could not update status");
    }
  }
});


  const handleStatusUpdate = (status: VolunteerStatus, reason?: string) => {
  if (!id) return;
  updateMut.mutate({ status, reason });
};

  const isPending = updateMut.isPending;
  const currentStatus = volunteer?.status;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b space-y-1">
            <SheetTitle>Volunteer Request Details</SheetTitle>
            <SheetDescription>
              Review the application and change status.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="py-6 space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !volunteer ? (
                <p className="text-sm text-red-500">
                  Failed to load volunteer details.
                </p>
              ) : (
                <>
                  {/* Status badge + actions */}
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Current Status
                      </label>
                      <div className="mt-1">
                        <Badge variant={statusBadgeVariant(volunteer.status)}>
                          {volunteer.status ?? "Pending"}
                        </Badge>
                      </div>
                    </div>

                    <PermissionGate
                      permission={PERMISSIONS.UPDATE_VOLUNTEER_REQUEST}
                    >
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({ open: true, status: "Approved" })
                          }
                          disabled={isPending || currentStatus === "Approved"}
                          className="gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({ open: true, status: "Pending" })
                          }
                          disabled={isPending || currentStatus === "Pending"}
                          className="gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          Pending
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStatusDialog({ open: true, status: "Rejected" })
                          }
                          disabled={isPending || currentStatus === "Rejected"}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </PermissionGate>
                  </div>

                  {/* Read-only fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                        {volunteer.fullname ?? "—"}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                        {volunteer.email ?? "—"}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Current Role
                      </label>
                      <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                        {volunteer.currentRole ?? "—"}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Volunteer Role
                      </label>
                      <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                        {volunteer.volunteerRole ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Purpose</label>
                    <div className="rounded-md border px-3 py-2 text-sm bg-muted/50 whitespace-pre-wrap">
                      {volunteer.purpose ?? "—"}
                    </div>
                  </div>

                  {/* Show rejection reason if present */}
                  {volunteer.rejectionReason && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-red-600">
                        {volunteer.status === "Rejected"
                          ? "Rejection Reason"
                          : "Admin Note"}
                      </label>
                      <div className="rounded-md border px-3 py-2 text-sm bg-red-50/50 text-red-700">
                        {volunteer.rejectionReason}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Status update dialog (Approve/Pending/Reject) */}
      <StatusUpdateDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog((prev) => ({ ...prev, open }))}
        status={statusDialog.status}
        onSubmit={(reason) => handleStatusUpdate(statusDialog.status, reason)}
        isPending={isPending}
      />
    </>
  );
}
