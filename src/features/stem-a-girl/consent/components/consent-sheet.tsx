// src/features/stem-a-girl/consent/components/consent-sheet.tsx

"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { toast } from "sonner";

import type {
  AccountStatus,
  ConsentRecord,
  ConsentStatus,
  ConsentUpdateInput,
} from "../types";
import { deactivateConsentAccount, updateConsentRecord } from "../api";
import { fmtDate } from "@/features/stem-a-girl/shared/format";
import { AccountStatusBadge, ConsentStateBadge } from "./consent-badges";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  record: ConsentRecord | null;
  initialMode: "view" | "edit";
};

// ---------- small helpers ----------
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

function DeactivateDialog({
  name,
  onConfirm,
  isPending,
}: {
  name: string;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Ban className="mr-2 h-4 w-4" />
          Deactivate Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate account?</AlertDialogTitle>
          <AlertDialogDescription>
            {name} will lose access to the platform until consent is approved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deactivating…" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------- the sheet ----------
export function ConsentSheet({ open, onOpenChange, record, initialMode }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(initialMode === "edit");
  const [consentStatus, setConsentStatus] =
    React.useState<ConsentStatus>("Pending");
  const [accountStatus, setAccountStatus] =
    React.useState<AccountStatus>("Inactive");

  // Reset the form every time the sheet opens for a record
  React.useEffect(() => {
    if (!open || !record) return;
    setEditing(initialMode === "edit");
    setConsentStatus(record.consentStatus);
    setAccountStatus(record.accountStatus);
  }, [open, record, initialMode]);

  const finish = (message: string) => {
    toast.success(message);
    qc.invalidateQueries({ queryKey: ["consent-records"] });
    onOpenChange(false);
  };

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConsentUpdateInput }) =>
      updateConsentRecord(id, data),
    onSuccess: () => finish("Record updated"),
    onError: () => toast.error("Could not update record"),
  });

  const deactivateMut = useMutation({
    mutationFn: (id: string) => deactivateConsentAccount(id),
    onSuccess: () => finish("Account deactivated"),
    onError: () => toast.error("Could not deactivate account"),
  });

  const saving = updateMut.isPending;

  if (!record) {
    return <Sheet open={false} onOpenChange={onOpenChange} />;
  }

  const isPending = record.consentStatus === "Pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-xl"
      >
        <SheetHeader className="space-y-1 border-b px-6 py-4">
          <div className="flex items-center gap-2 pr-8">
            <SheetTitle>{record.name}</SheetTitle>
            <ConsentStateBadge state={record.consentStatus} />
          </div>
          <SheetDescription>
            {editing
              ? "Edit consent compliance and account status."
              : "Guardian consent details and learner records."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-6">
            {editing ? (
              <>
                <Section title="Learner">
                  <Row label="Name">{record.name}</Row>
                  <Row label="Guardian">{record.guardianEmail}</Row>
                  <Row label="Current Course">{record.course}</Row>
                  {record.completedCourse && (
                    <Row label="Prior Completion">
                      <span className="text-green-700">
                        ✓ {record.completedCourse}
                      </span>
                    </Row>
                  )}
                </Section>

                <Section title="Update Status">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Consent Status</label>
                    <Select
                      value={consentStatus}
                      onValueChange={(v) => setConsentStatus(v as ConsentStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Deactivated">Deactivated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Account Status</label>
                    <Select
                      value={accountStatus}
                      onValueChange={(v) => setAccountStatus(v as AccountStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Section>

                {isPending && (
                  <div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-semibold text-destructive">
                      Admin Action
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This learner still has pending consent. You can
                      deactivate the account right away to restrict access.
                    </p>
                    <DeactivateDialog
                      name={record.name}
                      isPending={deactivateMut.isPending}
                      onConfirm={() => deactivateMut.mutate(record._id)}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <Section title="Learner Profile">
                  <Row label="Full Name">{record.name}</Row>
                  <Row label="Username">
                    <span className="font-mono">{record.username}</span>
                  </Row>
                  <Row label="Age">{record.age} years old</Row>
                  <Row label="Current Course">
                    {record.course} ({record.completion}%)
                  </Row>
                  {record.completedCourse && (
                    <Row label="Prior Completion">
                      <span className="text-green-700">
                        ✓ {record.completedCourse} (
                        {fmtDate(record.completedCourseDate)})
                      </span>
                    </Row>
                  )}
                </Section>

                <Section title="Guardian Information">
                  <Row label="Guardian Email">{record.guardianEmail}</Row>
                  <Row label="Submission Date">
                    {fmtDate(record.consentSubmittedAt)}
                  </Row>
                </Section>

                <Section title="Compliance & Verification">
                  <Row label="Consent Status">
                    <ConsentStateBadge state={record.consentStatus} />
                  </Row>
                  <Row label="Account Status">
                    <AccountStatusBadge status={record.accountStatus} />
                  </Row>
                </Section>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-background px-6 py-4">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  updateMut.mutate({
                    id: record._id,
                    data: { consentStatus, accountStatus },
                  })
                }
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              {isPending && (
                <DeactivateDialog
                  name={record.name}
                  isPending={deactivateMut.isPending}
                  onConfirm={() => deactivateMut.mutate(record._id)}
                />
              )}
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Status
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
