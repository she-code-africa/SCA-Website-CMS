// src/features/chapters/components/chapter-filters.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { ChapterFilters } from "@/features/chapters/types";
import { getChapterCategories } from "@/features/chapters/api";
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
  value: ChapterFilters;
  onChange: (next: ChapterFilters) => void;
  onReset: () => void;
};

export function ChapterFilters({ value, onChange, onReset }: Props) {
  const { data: categories = [] } = useQuery({
    queryKey: ["chapter-categories"],
    queryFn: getChapterCategories
  });

  const activeCount =
    Number(!!value.search?.trim()) +
    Number(value.state && value.state !== "") +
    Number(value.category && value.category !== "") +
    Number(value.sortBy && value.sortBy !== "");

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        placeholder="Search chapters…"
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
                <p className="text-sm font-medium">Category</p>
                <Select
                  value={value.category ?? "all"}
                  onValueChange={(v) =>
                    onChange({
                      ...value,
                      category: v === "all" ? "" : v
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
                    <SelectItem value="name">Name</SelectItem>
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
          className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700"
          onClick={() => window.dispatchEvent(new CustomEvent("chapter:add"))}
        >
          Add Chapter
        </Button>
      </div>
    </div>
  );
}
