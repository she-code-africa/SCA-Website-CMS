// src/features/enquiries/components/enquiry-filters.tsx
"use client";

import type { EnquiryFilters } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function EnquiryFilters({
  value,
  onChange,
  onReset
}: {
  value: EnquiryFilters;
  onChange: (v: EnquiryFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <Input
        placeholder="Search name or email…"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="lg:w-[320px]"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filters</Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 space-y-3">
          <div className="grid gap-1">
            <p className="text-sm font-medium">Status</p>
            <Select
              value={value.status || "all"}
              onValueChange={(v) =>
                onChange({ ...value, status: v === "all" ? "" : (v as any) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <p className="text-sm font-medium">Sort By</p>
            <Select
              value={value.sortBy || "all"}
              onValueChange={(v) =>
                onChange({ ...value, sortBy: v === "all" ? "" : (v as any) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Default</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="updatedAt">Date Updated</SelectItem>
                <SelectItem value="fullName">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="secondary" onClick={onReset}>
            Reset
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
