// src/features/stem-a-girl/participants/components/participant-filter-bar.tsx

"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LEARNER_COUNTRIES,
  LEARNER_COURSES,
} from "@/features/stem-a-girl/shared/dummy-learners";
import type { EnrolledPreset, ParticipantFilters } from "../types";

type Props = {
  value: ParticipantFilters;
  onChange: (next: ParticipantFilters) => void;
  onReset: () => void;
  onExport: () => void;
  exportDisabled?: boolean;
};

const AGE_OPTIONS = [
  { value: "10-13", label: "10–13 yrs" },
  { value: "14-17", label: "14–17 yrs" },
  { value: "18-21", label: "18–21 yrs" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Completed", label: "Completed" },
  { value: "Inactive", label: "Inactive" },
];

const ENROLLED_OPTIONS: { value: EnrolledPreset; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "quarter", label: "This quarter" },
  { value: "custom", label: "Custom range" },
];

// A labelled dropdown whose first option ("all") means "no filter"
function FilterSelect({
  label,
  value,
  onChange,
  allLabel,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="grid gap-1">
      <p className="text-sm font-medium">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ParticipantFilterBar({
  value,
  onChange,
  onReset,
  onExport,
  exportDisabled,
}: Props) {
  const activeCount =
    Number(!!value.search.trim()) +
    Number(value.course !== "all") +
    Number(value.age !== "all") +
    Number(value.country !== "all") +
    Number(value.status !== "all") +
    Number(value.enrolled !== "any");

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name or email…"
        value={value.search}
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
            className="z-50 max-h-[80vh] w-85 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-md border p-4 shadow-md"
          >
            <div className="grid gap-3">
              <FilterSelect
                label="Course"
                value={value.course}
                onChange={(v) => onChange({ ...value, course: v })}
                allLabel="All Courses"
                options={LEARNER_COURSES.map((c) => ({ value: c, label: c }))}
              />

              <FilterSelect
                label="Age Range"
                value={value.age}
                onChange={(v) => onChange({ ...value, age: v })}
                allLabel="All Ages (10–21)"
                options={AGE_OPTIONS}
              />

              <FilterSelect
                label="Country"
                value={value.country}
                onChange={(v) => onChange({ ...value, country: v })}
                allLabel="All Countries"
                options={LEARNER_COUNTRIES.map((c) => ({ value: c, label: c }))}
              />

              <FilterSelect
                label="Status"
                value={value.status}
                onChange={(v) => onChange({ ...value, status: v })}
                allLabel="All Statuses"
                options={STATUS_OPTIONS}
              />

              <div className="grid gap-1">
                <p className="text-sm font-medium">Enrolled</p>
                <Select
                  value={value.enrolled}
                  onValueChange={(v) =>
                    onChange({ ...value, enrolled: v as EnrolledPreset })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENROLLED_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {value.enrolled === "custom" && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    From
                    <Input
                      type="date"
                      value={value.dateFrom}
                      onChange={(e) =>
                        onChange({ ...value, dateFrom: e.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    To
                    <Input
                      type="date"
                      value={value.dateTo}
                      onChange={(e) =>
                        onChange({ ...value, dateTo: e.target.value })
                      }
                    />
                  </label>
                </div>
              )}

              <Button variant="secondary" onClick={onReset} className="w-full">
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          className="w-full sm:w-auto bg-[#C1127A] text-white hover:text-white hover:bg-[#a80e69]"
          onClick={onExport}
          disabled={exportDisabled}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
