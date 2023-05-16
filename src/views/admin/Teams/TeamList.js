import Table from "components/Table";
import React, { useState, useEffect } from "react";
import TeamCategory from "./TeamCategories";
import { getTeams } from "services";
import { useQuery } from "react-query";

const Team = () => {
	const [team, setTeam] = useState();
	const response = useQuery("team", getTeams);
	useEffect(() => {
		if (response.isSuccess) {
			setTeam(response.data);
		}
		console.log(response);
	}, [response]);
	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full lg:w-9/12 px-4">
					<div>
						<h1>Team</h1>
						<button>Add New Member</button>
					</div>
					{team && (
						<Table
							tableData={team}
							tableHead="SCA Team"
							addNew="addMember"
							showActions="true"
							edit="editMember"
						/>
					)}
				</div>
				<div className="w-full lg:w-3/12 px-4">
					<TeamCategory />
				</div>
			</div>
		</>
	);
};

export default Team;
