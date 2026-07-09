/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCourse, updateCourse, deleteCourse } from "../../api";
import { compressImage } from "../../utils";
import { toast } from "sonner";
import Modules from "../course-module";
import { useCourseModules } from "../../hooks/useCourseModules";
import { initialValues, type CourseFormValues } from "../add-course/defaults";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

const labelClass = "block uppercase text-muted-foreground text-xs font-bold";

type Props = {
  id: string;
};

const EditCoursePage = ({ id }: Props) => {
  const qc = useQueryClient();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState<CourseFormValues>(initialValues);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const {
    modules,
    openModules,
    openLessons,
    loadModules,
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

  //  Fetch existing course
  const courseQuery = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!courseQuery.data) return;
    const c: any = courseQuery.data;

    setFormValues({
      title: c.title ?? "",
      slug: c.slug ?? "",
      description: c.description ?? "",
      difficulty: c.difficulty ?? "",
      estimatedHours: c.estimatedHours ?? "",
      state: c.state ?? "",
      image: null, // new upload only; existing image tracked separately
    });
    setExistingImage(c.image ?? null);

    if (c.modules && c.modules.length > 0) {
      loadModules(c.modules);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseQuery.data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormValues((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  //  Mutations
  const updateMut = useMutation({
    mutationFn: (data: any) => updateCourse(id, data),
    onSuccess: () => {
      toast.success("Course updated");
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", id] });
      setEditMode(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update course"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["courses"] });
      router.push("/admin/stem-a-girl/courses");
    },
    onError: () => toast.error("Could not delete course"),
  });

  // Submit
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

    updateMut.mutate(formData);
  };

  //  Loading state
  if (courseQuery.isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", "")}>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-0.5 mb-6">
            <CardTitle className="text-2xl font-semibold">
              Edit Course
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {editMode ? "Edit the course details." : "View course details."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditMode((v) => !v)}>
              {editMode ? "View" : "Edit"}
            </Button>

            {!editMode && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete course?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMut.mutate(id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteMut.isPending}
                    >
                      {deleteMut.isPending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
                disabled={!editMode}
                placeholder="Enter course title"
                value={formValues.title}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass}>Slug *</label>
              <Input
                name="slug"
                disabled={!editMode}
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
              disabled={!editMode}
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
                disabled={!editMode}
                placeholder="Eg. Beginner to Advanced"
                value={formValues.difficulty}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1.5">
              <label className={labelClass}>Estimated Hours *</label>
              <Input
                name="estimatedHours"
                disabled={!editMode}
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
                disabled={!editMode}
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
              <label className={labelClass}>
                Course Image{" "}
                <span className="normal-case text-muted-foreground/70">
                  (optional)
                </span>
              </label>

              {/* Show existing image when not editing or no new file chosen yet */}
              {existingImage && !formValues.image ? (
                <Image
                  src={existingImage}
                  alt="course"
                  height={80}
                  width={128}
                  className=" object-cover rounded shadow"
                />
              ) : null}

              {editMode && (
                <input
                  title="Cover Image Upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              )}
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
            isDisabled={!editMode}
          />

          {editMode && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} disabled={updateMut.isPending}>
                {updateMut.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditCoursePage;
