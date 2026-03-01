"use client";

import * as React from "react";
import type { SchoolProgramsFilters } from "@/features/school-programs/types";
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
            className="z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-md border p-4 shadow-md"
          >
            <div className="grid gap-3">
              <div className="grid gap-1">
                <p className="text-sm font-medium">State</p>
                <Select
                  value={value.state ?? "all"}
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