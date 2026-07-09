/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  defaultModule,
  defaultLesson,
} from "../components/add-course/defaults";
import { CourseModule } from "../types";

export function useCourseModules() {
  const [modules, setModules] = useState<CourseModule[]>([defaultModule()]);
  const [openModules, setOpenModules] = useState<number[]>([0]);
  const [openLessons, setOpenLessons] = useState<Record<number, number[]>>({
    0: [0],
  });

  const loadModules = (fetched: CourseModule[]) => {
    if (!fetched || fetched.length === 0) return;
    setModules(fetched);
    setOpenModules([0]);
    const lessonsState: Record<number, number[]> = {};
    fetched.forEach((_, mi) => {
      lessonsState[mi] = [0];
    });
    setOpenLessons(lessonsState);
  };

  // ── Module helpers ──
  const toggleModule = (mi: number) => {
    setOpenModules((prev) =>
      prev.includes(mi) ? prev.filter((i) => i !== mi) : [...prev, mi],
    );
  };

  const addModule = () => {
    setModules((prev) => [...prev, defaultModule()]);
    const newIndex = modules.length;
    setOpenModules((prev) => [...prev, newIndex]);
    setOpenLessons((prev) => ({ ...prev, [newIndex]: [0] }));
  };

  const removeModule = (mi: number) => {
    setModules((prev) => prev.filter((_, i) => i !== mi));
    setOpenModules((prev) =>
      prev.filter((i) => i !== mi).map((i) => (i > mi ? i - 1 : i)),
    );
  };

  const handleModuleChange = (
    mi: number,
    field: keyof CourseModule,
    value: any,
  ) => {
    setModules((prev) =>
      prev.map((mod, i) => (i === mi ? { ...mod, [field]: value } : mod)),
    );
  };

  // ── Lesson helpers ──
  const toggleLesson = (mi: number, li: number) => {
    setOpenLessons((prev) => {
      const current = prev[mi] || [];
      return {
        ...prev,
        [mi]: current.includes(li)
          ? current.filter((i) => i !== li)
          : [...current, li],
      };
    });
  };

  const addLesson = (mi: number) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === mi ? { ...mod, lessons: [...mod.lessons, defaultLesson()] } : mod,
      ),
    );
    const newLessonIndex = modules[mi].lessons.length;
    setOpenLessons((prev) => ({
      ...prev,
      [mi]: [...(prev[mi] || []), newLessonIndex],
    }));
  };

  const removeLesson = (mi: number, li: number) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === mi
          ? { ...mod, lessons: mod.lessons.filter((_, j) => j !== li) }
          : mod,
      ),
    );
  };

  const handleLessonChange = (
    mi: number,
    li: number,
    field: string,
    value: any,
  ) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === mi
          ? {
              ...mod,
              lessons: mod.lessons.map((lesson, j) =>
                j === li ? { ...lesson, [field]: value } : lesson,
              ),
            }
          : mod,
      ),
    );
  };

  //Resource helpers
  const addResource = (mi: number, li: number) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === mi
          ? {
              ...mod,
              lessons: mod.lessons.map((lesson, j) =>
                j === li
                  ? {
                      ...lesson,
                      resources: [...lesson.resources, { title: "", url: "" }],
                    }
                  : lesson,
              ),
            }
          : mod,
      ),
    );
  };

  const removeResource = (mi: number, li: number, ri: number) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === mi
          ? {
              ...mod,
              lessons: mod.lessons.map((lesson, j) =>
                j === li
                  ? {
                      ...lesson,
                      resources: lesson.resources.filter((_, k) => k !== ri),
                    }
                  : lesson,
              ),
            }
          : mod,
      ),
    );
  };

  const handleResourceChange = (
    mi: number,
    li: number,
    ri: number,
    field: "title" | "url",
    value: string,
  ) => {
    setModules((prev) =>
      prev.map((mod, i) =>
        i === mi
          ? {
              ...mod,
              lessons: mod.lessons.map((lesson, j) =>
                j === li
                  ? {
                      ...lesson,
                      resources: lesson.resources.map((res, k) =>
                        k === ri ? { ...res, [field]: value } : res,
                      ),
                    }
                  : lesson,
              ),
            }
          : mod,
      ),
    );
  };

  // ── Submit-time cleanup: drop empty resources ──
  // const sanitizeModules = (mods: CourseModule[] = modules) =>
  //   mods.map((mod) => ({
  //     ...mod,
  //     lessons: mod.lessons.map((lesson) => ({
  //       ...lesson,
  //       resources: lesson.resources.filter(
  //         (res) => res.title.trim() || res.url.trim(),
  //       ),
  //     })),
  //   }));

  const sanitizeModules = (mods: CourseModule[] = modules) =>
    mods.map(({ _id, __v, createdAt, updatedAt, ...mod }) => ({
      ...mod,
      lessons: mod.lessons.map(
        ({ _id, __v, createdAt, updatedAt, isPreview, ...lesson }) => ({
          ...lesson,
          resources: lesson.resources
            .filter((res) => res.title.trim() || res.url.trim())
            .map(({ _id, __v, ...resource }) => resource),
        }),
      ),
    }));

  const resetModules = () => {
    setModules([defaultModule()]);
    setOpenModules([0]);
    setOpenLessons({ 0: [0] });
  };

  return {
    modules,
    openModules,
    openLessons,
    toggleModule,
    addModule,
    removeModule,
    handleModuleChange,
    toggleLesson,
    addLesson,
    removeLesson,
    handleLessonChange,
    addResource,
    removeResource,
    handleResourceChange,
    sanitizeModules,
    resetModules,
    loadModules,
  };
}
