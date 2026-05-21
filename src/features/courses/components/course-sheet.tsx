// "use client";

// import * as React from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Upload, X, GraduationCap } from "lucide-react";
// import {
//   createCourse,
//   editCourse,
//   getCourse,
//   deleteCourse
// } from "@/features/courses/api";
// import { getSchools } from "@/features/schools/api";
// import type { Course, CourseUpsertInput } from "@/features/courses/types";
// import { PermissionGate } from "@/components/PermissionGate";
// import { PERMISSIONS } from "@/lib/rbac/permissions";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription
// } from "@/components/ui/sheet";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger
// } from "@/components/ui/alert-dialog";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils/utils";

// type Props = {
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   mode: "create" | "view";
//   courseId?: string;
// };

// export function CourseSheet({ open, onOpenChange, mode, courseId }: Props) {
//   const qc = useQueryClient();
//   const [editing, setEditing] = React.useState(mode === "create");
//   const [imageFile, setImageFile] = React.useState<File | null>(null);
//   const [imagePreview, setImagePreview] = React.useState<string | null>(null);
//   const fileInputRef = React.useRef<HTMLInputElement>(null);

//   const { data: schools = [] } = useQuery({
//     queryKey: ["schools"],
//     queryFn: () => getSchools(),
//     enabled: open
//   });

//   const courseQuery = useQuery({
//     queryKey: ["course", courseId],
//     queryFn: () => getCourse(String(courseId)),
//     enabled: open && mode === "view" && !!courseId
//   });

//   const initialForm: CourseUpsertInput = React.useMemo(
//     () => ({
//       name: "",
//       shortDescription: "",
//       school: "",
//       applicationLink: "",
//       image: null
//     }),
//     []
//   );

//   const [form, setForm] = React.useState<CourseUpsertInput>(initialForm);

//   React.useEffect(() => {
//     if (!open) return;

//     if (mode === "create") {
//       setEditing(true);
//       setForm(initialForm);
//       setImageFile(null);
//       setImagePreview(null);
//       return;
//     }

//     if (courseQuery.data) {
//       const c = courseQuery.data as Course;
//       setEditing(false);
//       setImageFile(null);

//       if (c.image) {
//         setImagePreview(c.image);
//       } else {
//         setImagePreview(null);
//       }

//       setForm({
//         name: c.name ?? "",
//         shortDescription: c.shortDescription ?? "",
//         school: typeof c.school === "string" ? c.school : (c.school?._id ?? ""),
//         applicationLink: c.applicationLink ?? "",
//         image: null
//       });
//     }
//   }, [open, mode, courseQuery.data, initialForm]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const createMut = useMutation({
//     mutationFn: createCourse,
//     onSuccess: () => {
//       toast.success("Course added");
//       qc.invalidateQueries({ queryKey: ["courses"] });
//       onOpenChange(false);
//     },
//     onError: () => toast.error("Could not add course")
//   });

//   const updateMut = useMutation({
//     mutationFn: editCourse,
//     onSuccess: () => {
//       toast.success("Course updated");
//       qc.invalidateQueries({ queryKey: ["courses"] });
//       qc.invalidateQueries({ queryKey: ["course"] });
//       onOpenChange(false);
//     },
//     onError: () => toast.error("Could not update course")
//   });

//   const deleteMut = useMutation({
//     mutationFn: deleteCourse,
//     onSuccess: () => {
//       toast.success("Deleted");
//       qc.invalidateQueries({ queryKey: ["courses"] });
//       onOpenChange(false);
//     },
//     onError: () => toast.error("Could not delete")
//   });

//   const submit = async () => {
//     if (
//       !form.name.trim() ||
//       !form.shortDescription.trim() ||
//       !form.school ||
//       !form.applicationLink.trim()
//     ) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (mode === "create") {
//       if (!imageFile) {
//         toast.error("Please upload an image");
//         return;
//       }
//       createMut.mutate({ ...form, image: imageFile });
//       return;
//     }

//     if (!courseId) return;
//     updateMut.mutate({
//       id: courseId,
//       data: { ...form, image: imageFile ?? undefined }
//     });
//   };

//   const saving = createMut.isPending || updateMut.isPending;

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent
//         side="right"
//         className="w-full sm:max-w-xl p-0 flex flex-col"
//       >
//         <SheetHeader className="px-6 py-4 border-b space-y-1">
//           <SheetTitle>
//             {mode === "create" ? "Add Course" : "Course Details"}
//           </SheetTitle>
//           <SheetDescription>
//             {mode === "create"
//               ? "Add a new course to the system."
//               : "View, edit, or delete this course."}
//           </SheetDescription>
//         </SheetHeader>

//         <ScrollArea className="flex-1 px-6">
//           <div className="py-6 space-y-6">
//             {/* Top actions row */}
//             {mode === "view" && (
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <PermissionGate permission={PERMISSIONS.UPDATE_COURSE}>
//                   <Button
//                     variant="outline"
//                     className="w-full sm:w-auto"
//                     onClick={() => setEditing((v) => !v)}
//                   >
//                     {editing ? "View" : "Edit"}
//                   </Button>
//                 </PermissionGate>

//                 <div className="flex gap-2 w-full sm:w-auto">
//                   {!editing && (
//                     <PermissionGate permission={PERMISSIONS.DELETE_COURSE}>
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <Button
//                             variant="destructive"
//                             className="flex-1 sm:flex-none"
//                           >
//                             Delete
//                           </Button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle>Delete course?</AlertDialogTitle>
//                             <AlertDialogDescription>
//                               This action cannot be undone.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => {
//                                 if (!courseId) return;
//                                 deleteMut.mutate(courseId);
//                               }}
//                               className={cn(
//                                 "bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               )}
//                             >
//                               Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </PermissionGate>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Image Upload Section */}
//             <div className="grid gap-3">
//               <label className="text-sm font-medium">Course Image *</label>

//               <div className="flex flex-col sm:flex-row gap-4 items-center">
//                 <div className="relative group">
//                   <div
//                     className={cn(
//                       "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
//                       editing
//                         ? "border-muted-foreground/25 hover:border-muted-foreground/50"
//                         : "border-muted-foreground/25"
//                     )}
//                   >
//                     {imagePreview ? (
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-muted">
//                         <GraduationCap className="w-12 h-12 text-muted-foreground" />
//                       </div>
//                     )}
//                   </div>

//                   {editing && imagePreview && (
//                     <button
//                       type="button"
//                       onClick={handleRemoveImage}
//                       className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex-1 space-y-3">
//                   <div className="space-y-2">
//                     <p className="text-xs text-muted-foreground">
//                       Recommended: Square image, at least 400x400px. Max 5MB.
//                     </p>
//                   </div>

//                   {editing && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => fileInputRef.current?.click()}
//                       className="w-full sm:w-auto"
//                     >
//                       <Upload className="w-4 h-4 mr-2" />
//                       Choose Image
//                     </Button>
//                   )}

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     disabled={!editing}
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Form Fields */}
//             <div className="grid gap-4">
//               <div className="grid gap-2">
//                 <label className="text-sm font-medium">Course Name *</label>
//                 <Input
//                   value={form.name}
//                   disabled={!editing}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="Course name"
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <label className="text-sm font-medium">School *</label>
//                 <Select
//                   value={form.school}
//                   onValueChange={(v) => setForm({ ...form, school: v })}
//                   disabled={!editing}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select school" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {schools.map((s) => (
//                       <SelectItem key={s._id} value={s._id}>
//                         {s.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid gap-2">
//                 <label className="text-sm font-medium">
//                   Application Link *
//                 </label>
//                 <Input
//                   type="url"
//                   value={form.applicationLink}
//                   disabled={!editing}
//                   onChange={(e) =>
//                     setForm({ ...form, applicationLink: e.target.value })
//                   }
//                   placeholder="https://example.com/apply"
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <label className="text-sm font-medium">Description *</label>
//                 <Textarea
//                   value={form.shortDescription}
//                   disabled={!editing}
//                   onChange={(e) =>
//                     setForm({ ...form, shortDescription: e.target.value })
//                   }
//                   rows={8}
//                   placeholder="Course description..."
//                 />
//               </div>
//             </div>
//           </div>
//         </ScrollArea>

//         {/* Bottom action bar */}
//         {(mode === "create" || editing) && (
//           <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
//             <Button
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={saving}
//             >
//               Cancel
//             </Button>
//             <Button variant="default" onClick={submit} disabled={saving}>
//               {saving
//                 ? "Saving…"
//                 : mode === "create"
//                   ? "Add Course"
//                   : "Save Changes"}
//             </Button>
//           </div>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }

// src/features/courses/components/course-sheet.tsx
"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, GraduationCap } from "lucide-react";
import {
  createCourse,
  editCourse,
  getCourse,
  deleteCourse
} from "@/features/courses/api";
import { getSchools } from "@/features/schools/api";
import type { Course, CourseUpsertInput } from "@/features/courses/types";
import { PermissionGate } from "@/components/PermissionGate";
import { PERMISSIONS } from "@/lib/rbac/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils/utils";

// ---------- Image compression helper ----------
const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "view";
  courseId?: string;
};

export function CourseSheet({ open, onOpenChange, mode, courseId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = React.useState(mode === "create");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: () => getSchools(),
    enabled: open
  });

  const courseQuery = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(String(courseId)),
    enabled: open && mode === "view" && !!courseId
  });

  const initialForm: CourseUpsertInput = React.useMemo(
    () => ({
      name: "",
      shortDescription: "",
      school: "",
      applicationLink: "",
      image: null
    }),
    []
  );

  const [form, setForm] = React.useState<CourseUpsertInput>(initialForm);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setEditing(true);
      setForm(initialForm);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (courseQuery.data) {
      const c = courseQuery.data as Course;
      setEditing(false);
      setImageFile(null);

      if (c.image) {
        setImagePreview(c.image);
      } else {
        setImagePreview(null);
      }

      setForm({
        name: c.name ?? "",
        shortDescription: c.shortDescription ?? "",
        school:
          typeof c.school === "string" ? c.school : c.school?._id ?? "",
        applicationLink: c.applicationLink ?? "",
        image: null
      });
    }
  }, [open, mode, courseQuery.data, initialForm]);

  // ---------- Fixed image handler ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update state immediately – preview & file
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Reset input value so the same file can be re‑selected later
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createMut = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course added");
      qc.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not add course")
  });

  const updateMut = useMutation({
    mutationFn: editCourse,
    onSuccess: () => {
      toast.success("Course updated");
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course"] });
      onOpenChange(false);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Could not update course")
  });

  const deleteMut = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["courses"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Could not delete")
  });

  // ---------- Submit with base64 image ----------
  const submit = async () => {
    if (
      !form.name.trim() ||
      !form.shortDescription.trim() ||
      !form.school ||
      !form.applicationLink.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // In create mode, an image is required
    if (mode === "create" && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    let imageBase64: string | undefined = undefined;
    if (imageFile) {
      try {
        imageBase64 = await compressImage(imageFile, 800, 800, 0.7);
      } catch {
        toast.error("Failed to process image");
        return;
      }
    }

    const payload = {
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim(),
      school: form.school,
      applicationLink: form.applicationLink.trim(),
      ...(imageBase64 ? { image: imageBase64 } : {})
    };

    if (mode === "create") {
      createMut.mutate(payload as any);
      return;
    }

    if (!courseId) return;
    updateMut.mutate({ id: courseId, data: payload });
  };

  const saving = createMut.isPending || updateMut.isPending;
  const canEdit = mode === "create" || editing;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>
            {mode === "create" ? "Add Course" : "Course Details"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new course to the system."
              : editing
                ? "Edit the course details."
                : "View, edit, or delete this course."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Top actions row */}
            {mode === "view" && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PermissionGate permission={PERMISSIONS.UPDATE_COURSE}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? "View" : "Edit"}
                  </Button>
                </PermissionGate>

                <div className="flex gap-2 w-full sm:w-auto">
                  {!editing && (
                    <PermissionGate permission={PERMISSIONS.DELETE_COURSE}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex-1 sm:flex-none"
                          >
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
                              onClick={() => {
                                if (!courseId) return;
                                deleteMut.mutate(courseId);
                              }}
                              className={cn(
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              )}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PermissionGate>
                  )}
                </div>
              </div>
            )}

            {/* Image Upload Section */}
            <div className="grid gap-3">
              <label className="text-sm font-medium">Course Image *</label>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative group">
                  <div
                    className={cn(
                      "w-32 h-32 rounded-lg border-2 border-dashed overflow-hidden transition-colors",
                      canEdit
                        ? "border-muted-foreground/25 hover:border-muted-foreground/50"
                        : "border-muted-foreground/25"
                    )}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <GraduationCap className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {canEdit && imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 400x400px. Max 5MB.
                    </p>
                  </div>

                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={!canEdit}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Course Name *</label>
                <Input
                  value={form.name}
                  disabled={!canEdit}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Course name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">School *</label>
                <Select
                  value={form.school}
                  onValueChange={(v) => setForm({ ...form, school: v })}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Application Link *
                </label>
                <Input
                  type="url"
                  value={form.applicationLink}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm({ ...form, applicationLink: e.target.value })
                  }
                  placeholder="https://example.com/apply"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={form.shortDescription}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  rows={8}
                  placeholder="Course description..."
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        {(mode === "create" || editing) && (
          <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => {
                if (editing && mode === "view") setEditing(false);
                else onOpenChange(false);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={submit} disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Add Course"
                  : "Save Changes"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}