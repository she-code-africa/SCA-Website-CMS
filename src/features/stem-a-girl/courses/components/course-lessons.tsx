/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CourseModule, Lesson, Resource } from "../types";
import Image from "next/image";

type Props = {
  mi: number;
  mod: CourseModule;
  openLessons: Record<number, number[]>;
  toggleLesson: (mi: number, li: number) => void;
  addLesson: (mi: number) => void;
  removeLesson: (mi: number, li: number) => void;
  handleLessonChange: (
    mi: number,
    li: number,
    field: string,
    value: any,
  ) => void;
  addResource: (mi: number, li: number) => void;
  removeResource: (mi: number, li: number, ri: number) => void;
  handleResourceChange: (
    mi: number,
    li: number,
    ri: number,
    field: "title" | "url",
    value: string,
  ) => void;
  labelClass: string;
  isDisabled?: boolean;
};

const Lessons = ({
  mi,
  mod,
  openLessons,
  toggleLesson,
  addLesson,
  removeLesson,
  handleLessonChange,
  addResource,
  removeResource,
  handleResourceChange,
  labelClass,
  isDisabled,
}: Props) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h6 className="uppercase text-muted-foreground text-xs font-bold">
          Lessons
        </h6>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isDisabled}
          onClick={() => addLesson(mi)}
        >
          + Add Lesson
        </Button>
      </div>

      {mod.lessons.map((lesson:Lesson, li:number) => (
        <div key={li} className="mb-3 border rounded-md overflow-hidden">
          <div
            className="flex items-center justify-between px-3 py-2 bg-muted cursor-pointer select-none"
            onClick={() => toggleLesson(mi, li)}
          >
            <span className="text-xs font-semibold">
              {lesson.title || `Lesson ${li + 1}`}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  removeLesson(mi, li);
                }}
                className="text-xs text-destructive hover:opacity-80 font-medium"
              >
                Remove
              </button>
              <span className="text-muted-foreground text-xs">
                {(openLessons[mi] || []).includes(li) ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {(openLessons[mi] || []).includes(li) && (
            <div className="p-3 bg-background space-y-3">
              <div className="grid gap-3 grid-cols-2">
                <div className="grid gap-1.5">
                  <label className={labelClass}>Lesson Title *</label>
                  <Input
                    disabled={isDisabled}
                    placeholder="Enter lesson title"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(mi, li, "title", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className={labelClass}>Duration (minutes)</label>
                  <Input
                    disabled={isDisabled}
                    type="number"
                    placeholder="Eg. 15"
                    value={lesson.durationMinutes}
                    onChange={(e) =>
                      handleLessonChange(
                        mi,
                        li,
                        "durationMinutes",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className={labelClass}>Lesson Description</label>
                <Textarea
                  disabled={isDisabled}
                  placeholder="Enter lesson description"
                  rows={2}
                  value={lesson.description}
                  onChange={(e) =>
                    handleLessonChange(mi, li, "description", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div className="grid gap-1.5">
                  <label className={labelClass}>Video URL</label>
                  <Input
                    disabled={isDisabled}
                    placeholder="https://..."
                    value={lesson.videoUrl}
                    onChange={(e) =>
                      handleLessonChange(mi, li, "videoUrl", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className={labelClass}>Thumbnail</label>
                  <input
                    title='Upload file'
                    disabled={isDisabled}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        handleLessonChange(mi, li, "thumbnail", reader.result);
                      reader.readAsDataURL(file);
                    }}
                    className="text-sm"
                  />
                  {lesson.thumbnail && (
                    <Image
                      height={64}
                      width={112}
                      src={lesson.thumbnail}
                      alt="thumbnail preview"
                      className="mt-2 object-cover rounded shadow"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className={labelClass}>Order</label>
                <Input
                  disabled={isDisabled}
                  type="number"
                  placeholder="Eg. 1"
                  value={lesson.order}
                  onChange={(e) =>
                    handleLessonChange(mi, li, "order", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <label className={labelClass}>Practice Task</label>
                <Textarea
                  disabled={isDisabled}
                  placeholder="Describe the practice task..."
                  rows={2}
                  value={lesson.practiceTask}
                  onChange={(e) =>
                    handleLessonChange(mi, li, "practiceTask", e.target.value)
                  }
                />
              </div>

              {/* Resources */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h6 className="uppercase text-muted-foreground text-xs font-bold">
                    Resources
                  </h6>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isDisabled}
                    onClick={() => addResource(mi, li)}
                  >
                    + Add Resource
                  </Button>
                </div>

                {lesson.resources.map((res:Resource, ri:number) => (
                  <div key={ri} className="flex items-center gap-2 mb-2">
                    <Input
                      disabled={isDisabled}
                      placeholder="Resource title"
                      value={res.title}
                      onChange={(e) =>
                        handleResourceChange(
                          mi,
                          li,
                          ri,
                          "title",
                          e.target.value,
                        )
                      }
                      className="flex-1"
                    />
                    <Input
                      disabled={isDisabled}
                      placeholder="URL"
                      value={res.url}
                      onChange={(e) =>
                        handleResourceChange(mi, li, ri, "url", e.target.value)
                      }
                      className="flex-1"
                    />
                    {lesson.resources.length > 1 && (
                      <button
                        title="Remove resource"
                        type="button"
                        disabled={isDisabled}
                        onClick={() => removeResource(mi, li, ri)}
                        className="text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Lessons;
