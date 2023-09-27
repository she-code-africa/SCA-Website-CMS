import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import TeamCategory from "../../../components/Team/TeamCategories";
import { getTeams, deleteTeamMember } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { team as header } from "utils/headers";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeamModal from "components/Team/TeamModal";

const TeamList = () => {
	const [selectedId, setSelectedId] = useState();
	const [teamId, setTeamId] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const [newItem, setNewItem] = useState();
	const [team, setTeam] = useState([]);

	const { isLoading } = useQuery("team", getTeams, {
		onSuccess: (data) => {
			setTeam(data);
		},
		onError: (err) => {
			toast.error("Could not fetch team members");
		},
	});

	const handleModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleTeamModal = () => {
		setIsTeamModalOpen(!isTeamModalOpen);
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
						<button
							className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
							onClick={() => {
								setNewItem(true);
								setSelectedId("");
								setTeamId("");
								handleTeamModal();
							}}>
							Add
						</button>
					</div>
					<Table width="full">
						<TableHeaderRow className="grid grid-cols-5">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={isLoading}>
							{team?.map(
								({ _id, name, isLeader, state, team, createdAt }, index) => {
									return (
										<TableDataRow
											onClick={() => {
												setSelectedId(_id);
												setTeamId(team._id);
												handleTeamModal();
												setNewItem(false);
											}}
											key={index}
											className="grid grid-cols-5 px-4 py-3 bg-white group relative">
											<TableData>
												<span>{name}</span>
											</TableData>
											<TableData>{isLeader ? "Yes" : "No"}</TableData>
											<TableData>{team.name}</TableData>
											<TableData>{state}</TableData>
											<TableData>
												{moment(createdAt).format("DD MMM, YYYY")}
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
			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Team Member"
					isOpen={isDeleteModalOpen}
					handleModal={handleModal}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
			{isTeamModalOpen && (
				<TeamModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isTeamModalOpen}
					handleModal={handleTeamModal}
					catId={teamId}
					id={selectedId}
					newItem={newItem}
				/>
			)}
		</>
	);
};

export default TeamList;
