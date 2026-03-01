// src/features/companies/components/company-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, ExternalLink } from "lucide-react";
import {
  editCompany,
  getCompany,
  archiveCompany,
  unarchiveCompany
} from "@/features/companies/api";
import type { Company, CompanyUpdateInput } from "@/features/companies/types";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyId?: string;
};

export function CompanySheet({ open, onOpenChange, companyId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(false);

  const companyQuery = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(String(companyId)),
    enabled: open && !!companyId
  });

  const initialForm: CompanyUpdateInput = React.useMemo(
    () => ({
      companyName: "",
      email: "",
      companyUrl: "",
      companyPhone: "",
      companyDescription: "",
      companyLocation: "",
      contactName: ""
    }),
    []
  );

  const [form, setForm] = React.useState<CompanyUpdateInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (companyQuery.data && companyQuery.data.length > 0) {
      const c = companyQuery.data[0] as Company;
      setEditing(false);

      setForm({
        companyName: c.companyName ?? "",
        email: c.email ?? "",
        companyUrl: c.companyUrl ?? "",
        companyPhone: c.companyPhone ?? "",
        companyDescription: c.companyDescription ?? "",
        companyLocation: c.companyLocation ?? "",
        contactName: c.contactName ?? ""
      });
    }
  }, [open, companyQuery.data]);

  const updateMut = useMutation({
    mutationFn: editCompany,
    onSuccess: () => {
      toast.success("Company updated");
      qc.invalidateQueries({ queryKey: ["companies"] });
      qc.invalidateQueries({ queryKey: ["company"] });
      setEditing(false);
    },
    onError: () => toast.error("Could not update company")
  });

  const archiveMut = useMutation({
    mutationFn: archiveCompany,
    onSuccess: () => {
      toast.success("Archived");
      qc.invalidateQueries({ queryKey: ["companies"] });
      qc.invalidateQueries({ queryKey: ["company"] });
    },
    onError: () => toast.error("Could not archive")
  });

  const unarchiveMut = useMutation({
    mutationFn: unarchiveCompany,
    onSuccess: () => {
      toast.success("Unarchived");
      qc.invalidateQueries({ queryKey: ["companies"] });
      qc.invalidateQueries({ queryKey: ["company"] });
    },
    onError: () => toast.error("Could not unarchive")
  });

  const submit = async () => {
    if (!form.companyName.trim() || !form.email.trim()) {
      toast.error("Company name and email are required");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    // Validate URL if provided
    if (form.companyUrl.trim()) {
      try {
        new URL(form.companyUrl);
      } catch {
        toast.error("Please enter a valid company URL");
        return;
      }
    }

    if (!companyId) return;
    updateMut.mutate({ id: companyId, data: form });
  };

  const currentState =
    companyQuery.data && companyQuery.data.length > 0
      ? (companyQuery.data[0] as Company).state
      : undefined;
  const saving = updateMut.isPending;

  const currentCompany =
    companyQuery.data && companyQuery.data.length > 0
      ? (companyQuery.data[0] as Company)
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>Company Details</SheetTitle>
          <SheetDescription>
            View and edit company information. Companies are registered through
            the jobs portal.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "View" : "Edit"}
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  if (!companyId) return;
                  if (currentState === "active") archiveMut.mutate(companyId);
                  else unarchiveMut.mutate(companyId);
                }}
                disabled={archiveMut.isPending || unarchiveMut.isPending}
              >
                {currentState === "active" ? "Archive" : "Unarchive"}
              </Button>
            </div>

            {/* Company header with link */}
            {!editing && currentCompany?.companyUrl && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <a
                  href={currentCompany.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span className="truncate">Visit Company Website</span>
                </a>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Company Name *</label>
                <Input
                  value={form.companyName}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                  placeholder="Company Name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@company.com"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Contact Name</label>
                <Input
                  value={form.contactName}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, contactName: e.target.value })
                  }
                  placeholder="Contact Person"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  value={form.companyPhone}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, companyPhone: e.target.value })
                  }
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={form.companyLocation}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, companyLocation: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Company URL</label>
                <Input
                  type="url"
                  value={form.companyUrl}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, companyUrl: e.target.value })
                  }
                  placeholder="https://company.com"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Company Description
                </label>
                <Textarea
                  value={form.companyDescription}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({ ...form, companyDescription: e.target.value })
                  }
                  rows={6}
                  placeholder="Brief description of the company..."
                />
              </div>
            </div>

            {/* Jobs Section */}
            {currentCompany?.jobs && currentCompany.jobs.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">
                    Active Jobs ({currentCompany.jobs.length})
                  </h3>
                </div>
                <div className="grid gap-2">
                  {currentCompany.jobs.map((job: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border bg-muted/50 p-3 text-sm"
                    >
                      <p className="font-medium">
                        {job.title || "Untitled Job"}
                      </p>
                      {job.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {job.location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom action bar - Fixed */}
        {editing && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => setEditing(false)}
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
        )}
      </SheetContent>
    </Sheet>
  );
}
