// src/features/stem-a-girl/activities/components/activities-filters.tsx
"use client";

import type { SAGActivitiesFilters } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  value: SAGActivitiesFilters;
  onChange: (next: SAGActivitiesFilters) => void;
  onReset: () => void;
};

export function ActivitiesFilters({ value, onChange, onReset }: Props) {
  const activeCount = Number(!!value.search?.trim());

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by title or description…"
        value={value.search ?? ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-[320px]"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onReset}
          disabled={!activeCount}
        >
          Reset
        </Button>

        <Button
          variant="default"
          className="w-full sm:w-auto"
          onClick={() => window.dispatchEvent(new CustomEvent("sag-activity:add"))}
        >
          Add Activity
        </Button>
      </div>
    </div>
  );
}
