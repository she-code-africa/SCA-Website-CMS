import React from "react";
import { useHistory } from "react-router-dom";
import { paths } from "utils";
import TeamForm from "./TeamForm";

const TeamViewer = () => {
	const history = useHistory();
	const { pathname } = history.location;
	const New = pathname === paths.addMember;
	return <>{New ? <TeamForm newItem /> : <TeamForm />}</>;
};

export default TeamViewer;
