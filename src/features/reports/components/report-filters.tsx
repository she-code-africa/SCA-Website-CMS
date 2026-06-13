"use client";

import * as React from "react";
import type { ReportFilters } from "@/features/reports/types";
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
import Link from "next/link";

type Props = {
  value: ReportFilters;
  onChange: (next: ReportFilters) => void;
  onReset: () => void;
  yearOptions: string[];
};

export function ReportFilters({
  value,
  onChange,
  onReset,
  yearOptions
}: Props) {
  // Fixed: Using !! avoids the empty string comparison error
  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.year) +
    Number(!!value.sortBy);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by year or link…"
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
                <p className="text-sm font-medium">Year</p>
                <Select
                  value={value.year ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      year: v === "all" ? undefined : v
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onChange({ ...value, year: undefined })}
                >
                  Clear year filter
                </Button>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Sort By</p>
                <Select
                  value={value.sortBy ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      // Fixed: Cast to specific type instead of 'any'
                      sortBy:
                        v === "all" ? undefined : (v as ReportFilters["sortBy"])
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Default</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Date Updated</SelectItem>
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
          className="w-full sm:w-auto bg-primary hover:bg"
          onClick={() => window.dispatchEvent(new CustomEvent("report:add"))}
        >
          Add Report
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/admin/annual-report/logs">View annual report log</Link>
        </Button>
      </div>
    </div>
  );
}
