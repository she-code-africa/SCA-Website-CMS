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
	const headers = [
		{
			value: "_id",
			label: "ID",
		},
		{
			value: "name",
			label: "Name",
		},
		{
			value: "isLeader",
			label: "Team Lead",
		},
		{
			value: "team",
			label: "Team",
		},
		{
			value: "createdAt",
			label: "Created",
		},
		{
			value: "state",
			label: "State",
		},
	];
	return (
		<>
			<div className="flex flex-w">
				<div className="w-full lg:w-9/12">
					<div className="mb-8"></div>
					{team && (
						<Table
							tableData={team}
							tableHead="SCA Team"
							headers={headers}
							addNew
							view
						/>
					)}
				</div>
				<div className="w-full lg:w-3/12">
					<TeamCategory />
				</div>
			</div>
		</>
	);
};

export default Team;
