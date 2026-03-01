// src/features/reports/components/report-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addReport,
  editReport,
  getReport,
  deleteReport
} from "@/features/reports/api";
import type { Report, ReportUpsertInput } from "@/features/reports/types";

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
  reportId?: string;
};

export function ReportSheet({ open, onOpenChange, mode, reportId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const reportQuery = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReport(String(reportId)),
    enabled: open && mode === "view" && !!reportId
  });

  const initialForm: ReportUpsertInput = React.useMemo(
    () => ({
      year: "",
      link: ""
    }),
    []
  );

  const [form, setForm] = React.useState<ReportUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      return;
    }

    if (reportQuery.data) {
      const r = reportQuery.data as Report;
      setEditing(false);

      setForm({
        year: r.year ?? "",
        link: r.link ?? ""
      });
    }
  }, [open, mode, reportQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: addReport,
    onSuccess: () => {
      toast.success("Report added");
      qc.invalidateQueries({ queryKey: ["reports"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add report")
  });

  const updateMut = useMutation({
    mutationFn: editReport,
    onSuccess: () => {
      toast.success("Report updated");
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["report"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update report")
  });

  const deleteMut = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["reports"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (!form.year.trim() || !form.link.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate URL
    try {
      new URL(form.link);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    if (mode === "create") {
      createMut.mutate(form);
      return;
    }

    if (!reportId) return;
    updateMut.mutate({
      id: reportId,
      data: form
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
            {mode === "create" ? "Add Report" : "Report Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new annual report."
              : "View, edit, or delete this report."}
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
                        <AlertDialogTitle>Delete report?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (!reportId) return;
                            deleteMut.mutate(reportId);
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

            {reportQuery.isLoading && mode === "view" ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : (
              <>
                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Year *</label>
                    <Input
                      type="text"
                      value={form.year}
                      disabled={!editing}
                      onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                      }
                      placeholder="2024"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the year for this report (e.g., 2024)
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Link *</label>
                    <Input
                      type="url"
                      value={form.link}
                      disabled={!editing}
                      onChange={(e) =>
                        setForm({ ...form, link: e.target.value })
                      }
                      placeholder="https://shecodeafrica.org/reports/2024"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the full URL to the annual report
                    </p>
                  </div>
                </div>
              </>
            )}
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
                  ? "Add Report"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
