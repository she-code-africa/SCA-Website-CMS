// src/features/jobs/components/job-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addJob,
  archiveJob,
  editJob,
  getJob,
  publishJob,
  deleteJob,
  getJobCategories,
  getJobTypes
} from "@/features/jobs/api";
import type { Job, JobUpsertInput } from "@/features/jobs/types";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";
import { format } from "date-fns";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  jobId?: string;
};

export function JobSheet({ open, onOpenChange, mode, jobId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");

  const { data: categories = [] } = useQuery({
    queryKey: ["job-categories"],
    queryFn: getJobCategories
  });

  const { data: types = [] } = useQuery({
    queryKey: ["job-types"],
    queryFn: getJobTypes
  });

  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(String(jobId)),
    enabled: open && mode === "view" && !!jobId
  });

  const initialForm: JobUpsertInput = React.useMemo(
    () => ({
      title: "",
      description: "",
      location: "",
      deadline: format(new Date(), "yyyy-MM-dd"),
      minimumExperience: "",
      applicationLink: "",
      salaryCurrency: "",
      salaryRange: "",
      jobType: "",
      jobCategory: "",
      guestPost: true,
      guestPostMetaData: {
        companyName: "",
        companyEmail: "",
        companyUrl: ""
      }
    }),
    []
  );

  const [form, setForm] = React.useState<JobUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      return;
    }

    if (jobQuery.data) {
      const j = jobQuery.data as Job;
      setEditing(false);

      const jobTypeId =
        typeof j.jobType === "string" ? j.jobType : j.jobType?._id || "";
      const jobCategoryId =
        typeof j.jobCategory === "string"
          ? j.jobCategory
          : j.jobCategory?._id || "";

      setForm({
        title: j.title ?? "",
        description: j.description ?? "",
        location: j.location ?? "",
        deadline: j.deadline
          ? format(new Date(j.deadline), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        minimumExperience: j.minimumExperience ?? "",
        applicationLink: j.applicationLink ?? "",
        salaryCurrency: j.salaryCurrency ?? "",
        salaryRange: j.salaryRange ?? "",
        jobType: jobTypeId,
        jobCategory: jobCategoryId,
        guestPost: j.guestPost ?? true,
        guestPostMetaData: {
          companyName: j.guestPostMetaData?.companyName || "",
          companyEmail: j.guestPostMetaData?.companyEmail || "",
          companyUrl: j.guestPostMetaData?.companyUrl || ""
        },
        company: j.company
          ? {
              companyName: j.company.companyName || "",
              email: j.company.email || "",
              companyUrl: j.company.companyUrl || ""
            }
          : undefined
      });
    }
  }, [open, mode, jobQuery.data, initialForm]);

  const createMut = useMutation({
    mutationFn: addJob,
    onSuccess: () => {
      toast.success("Job added");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not add job")
  });

  const updateMut = useMutation({
    mutationFn: editJob,
    onSuccess: () => {
      toast.success("Job updated");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not update job")
  });

  const publishMut = useMutation({
    mutationFn: publishJob,
    onSuccess: () => {
      toast.success("Published");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
    },
    onError: () => toast.error("Could not publish")
  });

  const archiveMut = useMutation({
    mutationFn: archiveJob,
    onSuccess: () => {
      toast.success("Archived");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
    },
    onError: () => toast.error("Could not archive")
  });

  const deleteMut = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["jobs"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.applicationLink.trim() ||
      !form.deadline ||
      !form.jobType ||
      !form.jobCategory
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      new URL(form.applicationLink);
    } catch {
      toast.error("Please enter a valid application link");
      return;
    }

    const payload: JobUpsertInput = { ...form };

    if (form.guestPost && form.guestPostMetaData) {
      const isEmpty =
        !form.guestPostMetaData.companyName?.trim() &&
        !form.guestPostMetaData.companyEmail?.trim() &&
        !form.guestPostMetaData.companyUrl?.trim();

      if (isEmpty) delete payload.guestPostMetaData;
    } else if (form.company) {
      const isEmpty =
        !form.company.companyName?.trim() &&
        !form.company.email?.trim() &&
        !form.company.companyUrl?.trim();

      if (isEmpty) delete payload.company;
    }

    if (mode === "create") {
      createMut.mutate(payload);
      return;
    }

    if (!jobId) return;
    updateMut.mutate({ id: jobId, data: payload });
  };

  const currentState = (jobQuery.data as Job | undefined)?.state;
  const saving = createMut.isPending || updateMut.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Job" : "Job Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new job posting."
              : "View, edit, publish/archive, or delete this job."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_JOB}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                <div className="flex gap-2 w-full sm:w-auto">
                  <PermissionGate permission={PERMISSIONS.UPDATE_JOB}>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        if (!jobId) return;
                        if (currentState === "published")
                          archiveMut.mutate(jobId);
                        else publishMut.mutate(jobId);
                      }}
                      disabled={publishMut.isPending || archiveMut.isPending}
                    >
                      {currentState === "published" ? "Archive" : "Publish"}
                    </Button>
                  </PermissionGate>

                  {!editing && (
                    <PermissionGate permission={PERMISSIONS.DELETE_JOB}>
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
                            <AlertDialogTitle>Delete job?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (!jobId) return;
                                deleteMut.mutate(jobId);
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
              </div>
            )}

            {/* Job Details Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Job Details</h3>
                <p className="text-xs text-muted-foreground">
                  Basic information about the job posting
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={form.title}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Job Title"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Location *</label>
                  <Input
                    value={form.location}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Location"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Application Link *
                  </label>
                  <Input
                    type="url"
                    value={form.applicationLink}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, applicationLink: e.target.value })
                    }
                    placeholder="https://apply.example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Deadline *</label>
                  <Input
                    type="date"
                    value={form.deadline}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Minimum Experience
                  </label>
                  <Input
                    value={form.minimumExperience}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, minimumExperience: e.target.value })
                    }
                    placeholder="e.g., 3 years"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Salary Range</label>
                  <Input
                    value={form.salaryRange}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, salaryRange: e.target.value })
                    }
                    placeholder="e.g., 50,000 - 80,000"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Salary Currency</label>
                  <Input
                    value={form.salaryCurrency}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, salaryCurrency: e.target.value })
                    }
                    placeholder="e.g., USD, EUR, NGN"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Job Type *</label>
                  <Select
                    value={form.jobType}
                    disabled={!editing}
                    onValueChange={(v) => setForm({ ...form, jobType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-medium">Job Category *</label>
                  <Select
                    value={form.jobCategory}
                    disabled={!editing}
                    onValueChange={(v) => setForm({ ...form, jobCategory: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={form.description}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={8}
                    placeholder="Describe the job role, responsibilities, requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Company Information</h3>
                <p className="text-xs text-muted-foreground">
                  Optional company details (all or none)
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Guest Post</p>
                  <p className="text-xs text-muted-foreground">
                    External company posting
                  </p>
                </div>
                <Switch
                  checked={form.guestPost ?? true}
                  disabled={!editing}
                  onCheckedChange={(v) => setForm({ ...form, guestPost: v })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={
                      form.guestPost
                        ? (form.guestPostMetaData?.companyName ?? "")
                        : (form.company?.companyName ?? "")
                    }
                    disabled={!editing}
                    onChange={(e) => {
                      if (form.guestPost) {
                        setForm({
                          ...form,
                          guestPostMetaData: {
                            ...form.guestPostMetaData!,
                            companyName: e.target.value
                          }
                        });
                      } else {
                        setForm({
                          ...form,
                          company: {
                            ...form.company!,
                            companyName: e.target.value
                          }
                        });
                      }
                    }}
                    placeholder="Company Name"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Company Email</label>
                  <Input
                    type="email"
                    value={
                      form.guestPost
                        ? (form.guestPostMetaData?.companyEmail ?? "")
                        : (form.company?.email ?? "")
                    }
                    disabled={!editing}
                    onChange={(e) => {
                      if (form.guestPost) {
                        setForm({
                          ...form,
                          guestPostMetaData: {
                            ...form.guestPostMetaData!,
                            companyEmail: e.target.value
                          }
                        });
                      } else {
                        setForm({
                          ...form,
                          company: {
                            ...form.company!,
                            email: e.target.value
                          }
                        });
                      }
                    }}
                    placeholder="email@company.com"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Company URL</label>
                  <Input
                    type="url"
                    value={
                      form.guestPost
                        ? (form.guestPostMetaData?.companyUrl ?? "")
                        : (form.company?.companyUrl ?? "")
                    }
                    disabled={!editing}
                    onChange={(e) => {
                      if (form.guestPost) {
                        setForm({
                          ...form,
                          guestPostMetaData: {
                            ...form.guestPostMetaData!,
                            companyUrl: e.target.value
                          }
                        });
                      } else {
                        setForm({
                          ...form,
                          company: {
                            ...form.company!,
                            companyUrl: e.target.value
                          }
                        });
                      }
                    }}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {(mode === "create" && (
          <PermissionGate permission={PERMISSIONS.CREATE_JOB}>
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
                {saving ? "Saving…" : "Add Job"}
              </Button>
            </div>
          </PermissionGate>
        )) ||
          (mode === "view" && editing && (
            <PermissionGate permission={PERMISSIONS.UPDATE_JOB}>
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
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </PermissionGate>
          ))}
      </SheetContent>
    </Sheet>
  );
}
