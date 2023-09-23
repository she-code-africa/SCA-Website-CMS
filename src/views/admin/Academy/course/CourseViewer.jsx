import React from "react";
import { useHistory } from "react-router-dom";
import { paths } from "utils";
import CourseForm from "./CourseForm";

const CourseViewer = () => {
	const history = useHistory();
	const { pathname } = history.location;
	const New = pathname === paths.addCourse;
	return <>{New ? <CourseForm newItem /> : <CourseForm />}</>;
};

export default CourseViewer;
