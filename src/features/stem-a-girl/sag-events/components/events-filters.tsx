"use client";

import * as React from "react";
import type {
  SagActivity,
  SagEventsFilters,
  SagState
} from "@/features/sag-events/types";
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
  value: SagEventsFilters;
  onChange: (next: SagEventsFilters) => void;
  onReset: () => void;
  activities: SagActivity[];
  activitiesLoading: boolean;
};

export function EventsFilters({
  value,
  onChange,
  onReset,
  activities,
  activitiesLoading
}: Props) {
  const activeCount =
    Number(!!value.search?.trim()) +
    Number(!!value.state) +
    Number(!!value.activity);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by title, activity…"
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
                      state: v === "all" ? "" : (v as SagState)
                    })
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

              <div className="grid gap-1">
                <p className="text-sm font-medium">Activity</p>
                <Select
                  value={value.activity ?? "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, activity: v === "all" ? "" : v })
                  }
                  disabled={activitiesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={activitiesLoading ? "Loading…" : "Any"}
                    />
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
            window.dispatchEvent(new CustomEvent("sag-events:add"))
          }
        >
          Add Event
        </Button>
      </div>
    </div>
  );
}
