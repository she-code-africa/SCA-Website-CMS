// src/features/stem-a-girl/impact-stories/components/impact-stories-filters.tsx

"use client";

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
import type { ImpactStoryFilters } from "../types";

export function ImpactStoriesFilters({
  value,
  onChange,
  onReset,
  schools
}: {
  value: ImpactStoryFilters;
  onChange: (f: ImpactStoryFilters) => void;
  onReset: () => void;
  schools: Array<{ _id: string; name: string }>;
}) {
  const activeCount =
    Number(!!value.search) + Number(!!value.state) + Number(!!value.school);
  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search by name or story..."
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
                <p className="text-sm font-medium">State</p>
                <Select
                  value={value.state || "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, state: v === "all" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium">School</p>
                <Select
                  value={value.school || "all"}
                  onValueChange={(v) =>
                    onChange({ ...value, school: v === "all" ? "" : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {schools.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="secondary" onClick={onReset}>
                Reset All Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("impact-story:add"))
          }
        >
          Add Story
        </Button>
      </div>
    </div>
  );
}
