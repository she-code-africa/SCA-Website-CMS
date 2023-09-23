import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
	TableActions,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import TeamCategory from "./TeamCategories";
import { getTeams } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { team as header } from "utils/headers";
import { deleteTeamMember } from "services";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { paths } from "utils";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Team = () => {
	const [selectedId, setSelectedId] = useState();
	const [teamId, setTeamId] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const history = useHistory();

	const { isLoading, data } = useQuery("team", getTeams, {
		onError: (err) => {
			toast.error("Could not fetch team members");
		},
	});

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	const { mutate: deleteMember } = useMutation(deleteTeamMember, {
		onSuccess: () => {
			queryClient.invalidateQueries(["team"]);
			handleModal();
			toast.success("Team Member Deleted successfully");
		},
		onError: () => {
			handleModal();
			toast.error("Could not delete team member");
		},
	});

	const handleDelete = () => {
		deleteMember({ catId: teamId, id: selectedId });
	};

	return (
		<>
			<div className="w-full grid grid-cols-12 z-40 gap-4">
				<div className="col-span-9 bg-white rounded-md">
					<div className="flex items-center justify-between px-4 mt-3">
						<h5 className="font-medium text-xl">Team Members</h5>
						<Link
							to={paths.addMember}
							className="rounded bg-pink-500 text-white text-xs  px-4 py-2">
							Add
						</Link>
					</div>
					<Table width="full">
						<TableHeaderRow className="grid grid-cols-6">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={isLoading}>
							{data?.map(
								({ _id, name, isLeader, state, team, createdAt }, index) => {
									return (
										<TableDataRow
											key={index}
											className="grid grid-cols-6 px-4 py-3 bg-white">
											<TableData>
												<span>{name}</span>
											</TableData>
											<TableData>{isLeader ? "Yes" : "No"}</TableData>
											<TableData>{team.name}</TableData>
											<TableData>{state}</TableData>
											<TableData>
												{moment(createdAt).format("DD MMM, YYYY")}
											</TableData>
											<TableData noTruncate>
												<TableActions>
													<button
														className="mb-1 px-3 text-sm text-left"
														onClick={() => {
															history.push(
																`/admin/team/view/${team._id}/${_id}`
															);
														}}>
														View
													</button>
													<button
														className="mb-1 px-3 text-sm text-left"
														onClick={() => {
															history.push(
																`/admin/team/edit/${team._id}/${_id}`
															);
														}}>
														Edit
													</button>

													<button
														onClick={() => {
															setSelectedId(_id);
															setTeamId(team._id);
															handleModal();
														}}
														className="mb-1 px-3 text-sm text-left">
														Delete
													</button>
												</TableActions>
											</TableData>
										</TableDataRow>
									);
								}
							)}
						</TableBody>
					</Table>
				</div>
				<div className="col-span-3">
					<TeamCategory />
				</div>
			</div>
			<DeleteModal
				title="Delete Team Member"
				handleDelete={handleDelete}
				isOpen={isOpen}
				handleModal={handleModal}
			/>
			<ToastContainer />
		</>
	);
};

export default Team;
