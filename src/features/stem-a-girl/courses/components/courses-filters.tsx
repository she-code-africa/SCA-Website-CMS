// src/features/stem-a-girl/courses/components/courses-filters.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { SAGCoursesFilters } from "../types";
import { getSAGActivities } from "@/features/stem-a-girl/activities/api";
import type { SAGActivity } from "@/features/stem-a-girl/activities/types";

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
  value: SAGCoursesFilters;
  onChange: (next: SAGCoursesFilters) => void;
  onReset: () => void;
};

export function CoursesFilters({ value, onChange, onReset }: Props) {
  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.state) +
    Number(!!value.activity);

  const activitiesQuery = useQuery({
    queryKey: ["sag-activities"],
    queryFn: () => getSAGActivities({}),
    staleTime: 60_000
  });

  const activities = (activitiesQuery.data ?? []) as SAGActivity[];

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search title, description, or activity…"
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
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium">Activity</p>
                <Select
                  value={value.activity ?? "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, activity: v === "all" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {activities.map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onChange({ ...value, activity: "" })}
                >
                  Clear activity filter
                </Button>
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
            window.dispatchEvent(new CustomEvent("sag-course:add"))
          }
        >
          Add Course
        </Button>
      </div>
    </div>
  );
}
