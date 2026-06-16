// src/features/school-programs/components/school-program-filters.tsx

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { SchoolProgramsFilters } from "@/features/school-programs/types";
import { getSchools } from "@/features/schools/api";
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
  value: SchoolProgramsFilters;
  onChange: (next: SchoolProgramsFilters) => void;
  onReset: () => void;
};

export function SchoolProgramFilters({ value, onChange, onReset }: Props) {
  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.state) +
    Number(!!value.school);

  // Fetch schools list when the popover opens (or on mount)
  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
    staleTime: 60_000
  });

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by title, cohort, or school…"
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
              {/* State filter */}
              <div className="grid gap-1">
                <p className="text-sm font-medium">State</p>
                <Select
                  value={value.state || "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, state: v === "all" ? "" : (v as any) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* School filter – NEW */}
              <div className="grid gap-1">
                <p className="text-sm font-medium">School</p>
                <Select
                  value={value.school || "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, school: v === "all" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {schools.map((s: any) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="default"
          className="w-full sm:w-auto"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("school-program:add"))
          }
        >
          Add Program
        </Button>
      </div>
    </div>
  );
}