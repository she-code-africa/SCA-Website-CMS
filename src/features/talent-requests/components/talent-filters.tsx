// src/features/talent-requests/components/talent-filters.tsx
"use client";

import * as React from "react";
import type { TalentRequestFilters } from "../types";
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

type Props = {
  value: TalentRequestFilters;
  onChange: (next: TalentRequestFilters) => void;
  onReset: () => void;
};

export function TalentRequestFilters({ value, onChange, onReset }: Props) {
  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.status) +
    Number(!!value.experienceLevel?.trim()) +
    Number(!!value.sortBy);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name, email, company, or role…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-[320px]"
      />

      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Filters{activeCount ? ` (${activeCount})` : ""}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={8}
            className="z-50 w-85 max-w-[calc(100vw-2rem)] rounded-md border p-4 shadow-md"
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <p className="text-sm font-medium">Status</p>
                <Select
                  value={value.status || "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      status: v === "all" ? "" : (v as any)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Experience Level</p>
                <Input
                  placeholder='e.g. "speaker"'
                  value={value.experienceLevel ?? ""}
                  onChange={(e) =>
                    onChange({ ...value, experienceLevel: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Sort By</p>
                <Select
                  value={value.sortBy || "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      sortBy: v === "all" ? "" : (v as any)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Default</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Date Updated</SelectItem>
                    <SelectItem value="fullname">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
