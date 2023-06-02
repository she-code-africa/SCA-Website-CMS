import Table from "components/Table";
import React, { useState, useEffect } from "react";
import TeamCategory from "./TeamCategories";
import { getTeams } from "services";
import { useMutation, useQuery } from "react-query";
import { team as teamHeader } from "utils/headers";
import Loader from "components/Loader";
import { deleteTeamMember } from "services";

const Team = () => {
	const [team, setTeam] = useState();
	const { isSuccess, isLoading, data } = useQuery("team", getTeams);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (isSuccess) {
			setTeam(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	const deleteMember = useMutation(deleteTeamMember, {
		onSuccess: () => {
			setLoading(false);
			console.log("success");
		},
		onError: () => {
			console.log("error");
		},
	});

	const deleteFunc = async (catId, id) => {
		setLoading(true);
		await deleteMember.mutateAsync({ catId: catId, id: id });
	};
	return (
		<div className="flex flex-w w-full">
			{loading || isLoading ? (
				<Loader />
			) : (
				<>
					<div className="w-full lg:w-9/12">
						<div className="mb-8"></div>
						{team && teamHeader && (
							<Table
								tableData={team}
								tableHead="SCA Team"
								headers={teamHeader}
								actions={["view", "delete"]}
								addNew
								handleDelete={deleteFunc}
							/>
						)}
					</div>
					<div className="w-full lg:w-3/12">
						<TeamCategory />
					</div>
				</>
			)}
		</div>
	);
};

export default Team;
