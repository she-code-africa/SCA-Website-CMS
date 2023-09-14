import React from "react";
import { useHistory } from "react-router-dom";
import { paths } from "utils";
import TestimonialForm from "./TestimonialForm";

const TestimonialViewer = () => {
	const history = useHistory();
	const { pathname } = history.location;
	const New = pathname === paths.addNewTestimonial;
	console.log(pathname);
	return <>{New ? <TestimonialForm newItem /> : <TestimonialForm />}</>;
};

export default TestimonialViewer;
