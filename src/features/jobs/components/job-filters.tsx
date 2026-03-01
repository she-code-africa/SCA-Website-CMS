// src/features/jobs/components/job-filters.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { JobFilters } from "@/features/jobs/types";
import { getJobCategories, getJobTypes } from "@/features/jobs/api";
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
  value: JobFilters;
  onChange: (next: JobFilters) => void;
  onReset: () => void;
};

export function JobFilters({ value, onChange, onReset }: Props) {
  const { data: categories = [] } = useQuery({
    queryKey: ["job-categories"],
    queryFn: getJobCategories
  });

  const { data: types = [] } = useQuery({
    queryKey: ["job-types"],
    queryFn: getJobTypes
  });

  const activeCount =
    Number(!!value.search?.trim()) +
    Number(value.state && value.state !== "") +
    Number(value.jobType && value.jobType !== "") +
    Number(value.jobCategory && value.jobCategory !== "") +
    Number(value.sortBy && value.sortBy !== "");

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by title…"
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
                    onChange({
                      ...value,
                      state: v === "all" ? "" : (v as any)
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Job Type</p>
                <Select
                  value={value.jobType ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      jobType: v === "all" ? "" : v
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {types.map((t: any) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Job Category</p>
                <Select
                  value={value.jobCategory ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      jobCategory: v === "all" ? "" : v
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {categories.map((c: any) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Sort By</p>
                <Select
                  value={value.sortBy ?? "all"}
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
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="updatedAt">Date Updated</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
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
          className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700"
          onClick={() => window.dispatchEvent(new CustomEvent("job:add"))}
        >
          Add Job
        </Button>
      </div>
    </div>
  );
}
