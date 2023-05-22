import Table from "components/Table";
import React, { useState, useEffect } from "react";
import TeamCategory from "./TeamCategories";
import { getTeams } from "services";
import { useQuery } from "react-query";
import { team as teamHeader } from "utils/headers";

const Team = () => {
	const [team, setTeam] = useState();
	const response = useQuery("team", getTeams);
	useEffect(() => {
		if (response.isSuccess) {
			setTeam(response.data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [response.isSuccess]);
	return (
		<>
			<div className="flex flex-w w-full">
				<div className="w-full lg:w-9/12">
					<div className="mb-8"></div>
					{team && teamHeader && (
						<Table
							tableData={team}
							tableHead="SCA Team"
							headers={teamHeader}
							addNew
							view
							deleteBtn
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
