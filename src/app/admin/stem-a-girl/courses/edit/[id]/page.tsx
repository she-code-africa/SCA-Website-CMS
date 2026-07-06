"use client";
import EditCoursePage from "@/features/stem-a-girl/courses/components/edit-course";
import { useParams } from "next/navigation";
import React from "react";

const EditCourse = () => {
  const params = useParams();
  const id = params.id as string;
  return <EditCoursePage id={id} />
};

export default EditCourse;
