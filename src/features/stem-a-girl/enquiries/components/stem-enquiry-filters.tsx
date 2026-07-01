// src/features/stem-a-girl/enquiries/components/stem-enquiry-filters.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import type { StemEnquiryFilters } from "../types";

export function StemEnquiryFilters({
  value,
  onChange,
  onReset
}: {
  value: StemEnquiryFilters;
  onChange: (f: StemEnquiryFilters) => void;
  onReset: () => void;
}) {
  const activeCount =
    Number(!!value.status) +
    Number(!!value.startDate) +
    Number(!!value.endDate);
  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name, email or subject..."
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
          <PopoverContent className="w-[340px] p-4">
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium">Status</p>
                <select
                  value={value.status || ""}
                  onChange={(e) =>
                    onChange({ ...value, status: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
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
      </div>
    </div>
  );
}
