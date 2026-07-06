/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Lessons from "./course-lessons";
import { CourseModule } from "../types";

type Props = {
  modules: CourseModule[];
  openModules: number[];
  toggleModule: (mi: number) => void;
  removeModule: (mi: number) => void;
  handleModuleChange: (
    mi: number,
    field: keyof CourseModule,
    value: any,
  ) => void;
  addModule: () => void;
  addLesson: (mi: number) => void;
  addResource: (mi: number, li: number) => void;
  toggleLesson: (mi: number, li: number) => void;
  removeLesson: (mi: number, li: number) => void;
  openLessons: Record<number, number[]>;
  handleLessonChange: (
    mi: number,
    li: number,
    field: string,
    value: any,
  ) => void;
  handleResourceChange: (
    mi: number,
    li: number,
    ri: number,
    field: "title" | "url",
    value: string,
  ) => void;
  removeResource: (mi: number, li: number, ri: number) => void;
  isDisabled?: boolean;
};

const labelClass = "block uppercase text-muted-foreground text-xs font-bold";

const Modules = ({
  modules,
  openModules,
  toggleModule,
  removeModule,
  handleModuleChange,
  addModule,
  addLesson,
  addResource,
  toggleLesson,
  removeLesson,
  openLessons,
  handleLessonChange,
  handleResourceChange,
  removeResource,
  isDisabled,
}: Props) => {
  return (
    <section className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h5 className="block uppercase text-muted-foreground text-xs font-bold">
          Course Modules
        </h5>
        <Button type="button" disabled={isDisabled} onClick={addModule}>
          + Add Module
        </Button>
      </div>

      {modules.map((mod, mi) => (
        <div
          key={mi}
          className="mb-4 border rounded-md shadow-sm overflow-hidden"
        >
          <div
            className="flex items-center justify-between px-4 py-3 bg-muted cursor-pointer select-none"
            onClick={() => toggleModule(mi)}
          >
            <span className="text-sm font-semibold">
              {mod.title || `Module ${mi + 1}`}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeModule(mi);
                }}
                className="text-xs text-destructive hover:opacity-80 font-medium"
              >
                Remove
              </button>
              <span className="text-muted-foreground text-xs">
                {openModules.includes(mi) ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {openModules.includes(mi) && (
            <div className="p-4 bg-background space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="grid gap-1.5">
                  <label className={labelClass}>Module Title *</label>
                  <Input
                    disabled={isDisabled}
                    placeholder="Enter module title"
                    value={mod.title}
                    onChange={(e) =>
                      handleModuleChange(mi, "title", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className={labelClass}>Week Label</label>
                  <Input
                    disabled={isDisabled}
                    placeholder="Eg. Week 1"
                    value={mod.weekLabel}
                    onChange={(e) =>
                      handleModuleChange(mi, "weekLabel", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className={labelClass}>Module Description</label>
                <Textarea
                  disabled={isDisabled}
                  placeholder="Enter module description"
                  rows={3}
                  value={mod.description}
                  onChange={(e) =>
                    handleModuleChange(mi, "description", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="grid gap-1.5">
                  <label className={labelClass}>Order</label>
                  <Input
                    disabled={isDisabled}
                    type="number"
                    placeholder="Eg. 1"
                    value={mod.order}
                    onChange={(e) =>
                      handleModuleChange(mi, "order", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className={labelClass}>Estimated Minutes</label>
                  <Input
                    disabled={isDisabled}
                    type="number"
                    placeholder="Eg. 60"
                    value={mod.estimatedMinutes}
                    onChange={(e) =>
                      handleModuleChange(mi, "estimatedMinutes", e.target.value)
                    }
                  />
                </div>
              </div>

              <Lessons
                mi={mi}
                mod={mod}
                openLessons={openLessons}
                toggleLesson={toggleLesson}
                addLesson={addLesson}
                removeLesson={removeLesson}
                handleLessonChange={handleLessonChange}
                addResource={addResource}
                removeResource={removeResource}
                handleResourceChange={handleResourceChange}
                labelClass={labelClass}
                isDisabled={isDisabled}
              />

            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Modules;
