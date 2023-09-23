import React from "react";
import { useHistory } from "react-router-dom";
import { paths } from "utils";
import SPForm from "./SPForm";

const SchoolProgramViewer = () => {
	const history = useHistory();
	const { pathname } = history.location;
	const New = pathname === paths.addSchoolProgram;
	return <>{New ? <SPForm newItem /> : <SPForm />}</>;
};

export default SchoolProgramViewer;
