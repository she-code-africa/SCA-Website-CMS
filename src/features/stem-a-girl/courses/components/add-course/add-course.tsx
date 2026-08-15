/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createCourse } from "../../api";
import { toast } from "sonner";
import { initialValues } from "./defaults";
import Modules from "../course-module";
import { useCourseModules } from "../../hooks/useCourseModules";
import { compressImage } from "../../utils";

const labelClass = "block uppercase text-muted-foreground text-xs font-bold";

const AddACoursePage = () => {
  const qc = useQueryClient();
  const router = useRouter();

  const [formValues, setFormValues] = useState(initialValues);

  const {
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
  } = useCourseModules();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormValues((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // CREATE COURSE MUTATION
  const createMut = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created");
      qc.invalidateQueries({ queryKey: ["courses"] });
      router.push("/admin/stem-a-girl/courses");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not create course"),
  });



  const handleSubmit = async () => {
    const {
      title,
      description,
      image,
      estimatedHours,
      difficulty,
      slug,
      state,
    } = formValues;

    if (!title.trim() || !slug.trim() || !description.trim()) {
      toast.error("Please fill required fields");
      return;
    }

      let imageValue: string | undefined = undefined;

    if (image) {
      try {
        imageValue = await compressImage(image, 800, 800, 0.7);
      } catch {
        toast.error("Failed to process image");
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
  if (imageValue) formData.append("image", imageValue);
    formData.append("estimatedHours", estimatedHours);
    formData.append("difficulty", difficulty);
    formData.append("slug", slug);
    formData.append("state", state);
    formData.append("modules", JSON.stringify(sanitizeModules()));

    createMut.mutate(formData as any);
  };

  return (
    <Card className={cn("overflow-hidden", "")}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-0.5 mb-6">
            <CardTitle className="text-2xl font-semibold">
              Create Course
            </CardTitle>
            <p className="text-sm text-muted-foreground">Add a new course.</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-1.5">
              <label className={labelClass}>Course Title *</label>
              <Input
                name="title"
                placeholder="Enter course title"
                value={formValues.title}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass}>Slug *</label>
              <Input
                name="slug"
                placeholder="Eg. intro-to-python"
                value={formValues.slug}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className={labelClass}>Description</label>
            <Textarea
              name="description"
              placeholder="Enter course description"
              value={formValues.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-1.5">
              <label className={labelClass}>Course Difficulty *</label>
              <Input
                name="difficulty"
                placeholder="Eg. Beginner to Advanced"
                value={formValues.difficulty}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass}>Estimated Hours *</label>
              <Input
                name="estimatedHours"
                placeholder="9 - 12 hours"
                value={formValues.estimatedHours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="grid gap-1.5">
              <label className={labelClass}>State</label>
              <Select
                value={formValues.state}
                onValueChange={(v) =>
                  setFormValues((prev) => ({ ...prev, state: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <label className={labelClass}>Course Image</label>
              <input
                title="Cover Image Upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>

          <Modules
            modules={modules}
            openModules={openModules}
            openLessons={openLessons}
            toggleModule={toggleModule}
            addModule={addModule}
            removeModule={removeModule}
            handleModuleChange={handleModuleChange}
            toggleLesson={toggleLesson}
            addLesson={addLesson}
            removeLesson={removeLesson}
            handleLessonChange={handleLessonChange}
            addResource={addResource}
            removeResource={removeResource}
            handleResourceChange={handleResourceChange}
          />

          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit} disabled={createMut.isPending}>
              {createMut.isPending ? "Creating…" : "Create Course"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddACoursePage;
