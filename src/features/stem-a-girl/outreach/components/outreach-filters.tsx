// src/features/stem-a-girl/outreach/components/outreach-filters.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import type { OutreachFilters } from "../types";

export function OutreachFilters({
  value,
  onChange,
  onReset
}: {
  value: OutreachFilters;
  onChange: (f: OutreachFilters) => void;
  onReset: () => void;
}) {
  const activeCount =
    Number(!!value.state) + Number(!!value.startDate) + Number(!!value.endDate);
  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by state or description..."
        value={value.search || ""}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
        className="w-full lg:w-[320px]"
      />
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              Filters{activeCount ? ` (${activeCount})` : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-85 p-4">
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium">State</p>
                <Input
                  placeholder="Filter by state"
                  value={value.state || ""}
                  onChange={(e) =>
                    onChange({ ...value, state: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <Input
                  type="date"
                  value={value.startDate || ""}
                  onChange={(e) =>
                    onChange({ ...value, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium">End Date</p>
                <Input
                  type="date"
                  value={value.endDate || ""}
                  onChange={(e) =>
                    onChange({ ...value, endDate: e.target.value })
                  }
                />
              </div>
              <Button variant="secondary" onClick={onReset}>
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent("outreach:add"))}
        >
          Add Outreach
        </Button>
      </div>
    </div>
  );
}
