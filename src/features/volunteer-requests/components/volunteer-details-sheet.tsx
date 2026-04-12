"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  VolunteerRequest,
  VolunteerStatus
} from "@/features/volunteer-requests/types";
import {
  getVolunteerRequest,
  updateVolunteerStatus
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string | null;
};

export function VolunteerDetailsSheet({ open, onOpenChange, id }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);

  const memberQuery = useQuery({
    queryKey: ["volunteer", id],
    queryFn: () => getVolunteerRequest(String(id)),
    enabled: open && !!id
  });

  const v = memberQuery.data as VolunteerRequest | undefined;

  const [status, setStatus] = React.useState<VolunteerStatus>("Pending");

  React.useEffect(() => {
    if (!open) return;
    setEditing(false);
    setStatus((v?.status ?? "Pending") as VolunteerStatus);
  }, [open, v?.status]);

  const updateMut = useMutation({
    mutationFn: updateVolunteerStatus,
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["volunteers"] });
      qc.invalidateQueries({ queryKey: ["volunteer"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update status")
  });

  const submit = async () => {
    if (!id) return;
    updateMut.mutate({ id: String(id), status });
  };

  const saving = updateMut.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>Volunteer Request Details</SheetTitle>
          <SheetDescription>
            View and manage volunteer request status.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <PermissionGate permission={PERMISSIONS.UPDATE_VOLUNTEER_REQUEST}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setEditing((v) => !v)}
                >
                  {editing ? "View" : "Edit"}
                </Button>
              </PermissionGate>
            </div>

            {memberQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : !v ? (
              <p className="text-sm text-red-500">
                Failed to load volunteer details.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                      {v.fullname ?? "—"}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                      {v.email ?? "—"}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Current Role</label>
                    <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                      {v.currentRole ?? "—"}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">
                      Volunteer Role
                    </label>
                    <div className="rounded-md border px-3 py-2 text-sm bg-muted/50">
                      {v.volunteerRole ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Purpose</label>
                  <div className="rounded-md border px-3 py-2 text-sm bg-muted/50 min-h-25">
                    {v.purpose ?? "—"}
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as VolunteerStatus)}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {editing && (
          <PermissionGate permission={PERMISSIONS.UPDATE_VOLUNTEER_REQUEST}>
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={submit} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </PermissionGate>
        )}
      </SheetContent>
    </Sheet>
  );
}
