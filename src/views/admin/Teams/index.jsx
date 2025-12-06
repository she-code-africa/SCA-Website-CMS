// TeamList.js - Updated to use GenericFilter
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import TeamCategory from "components/Team/TeamCategories";
import { deleteTeamMember } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { team as header } from "utils/headers";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeamModal from "components/Team/TeamModal";
import Pagination from "components/Pagination";
import SearchInput from "components/Inputs/SearchInput";
import FilterDropdown from "components/Inputs/FilterDropdown"; // Updated import
import { LuListFilter } from "react-icons/lu";

const TeamList = () => {
	const [selectedId, setSelectedId] = useState();
	const [teamId, setTeamId] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const [newItem, setNewItem] = useState();
	const [team, setTeam] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const itemsPerPage = 10;
	const [showFilter, setShowFilter] = useState(false);
	const [filters, setFilters] = useState({
		search: "",
		isLeader: "",
		state: "",
		team: "",
	});

	// Configuration for team members filters
	const teamFilterConfig = [
		{
			key: "isLeader",
			label: "Team Lead",
			type: "select",
			options: [
				{ value: "true", label: "Yes" },
				{ value: "false", label: "No" },
			],
		},
		{
			key: "state",
			label: "State",
			type: "select",
			options: [
				{ value: "draft", label: "Draft" },
				{ value: "archived", label: "Archived" },
				{ value: "published", label: "Published" },
			],
		},
		{
			key: "team",
			label: "Team",
			type: "select",
			options: [
				{ value: "Dev team", label: "Dev team" },
				{ value: "Support Team", label: "Support Team" },
				{ value: "Advisors", label: "Advisors" },
				{ value: "Full Time", label: "Full Time" },
			],
		},
	];

	const buildQueryParams = (filters) => {
		const params = new URLSearchParams();
		if (filters.search) params.append("search", filters.search);
		if (filters.isLeader) params.append("isLeader", filters.isLeader);
		if (filters.state) params.append("state", filters.state);
		if (filters.team) params.append("team", filters.team);
		return params.toString();
	};

	const { isLoading } = useQuery(
		["team", filters],
		async () => {
			const query = buildQueryParams(filters);
			const res = await fetch(
				`${process.env.REACT_APP_BASE_URL}/teams/members?${query}`
			);
			const data = await res.json();
			return data.data;
		},
		{
			onSuccess: (data) => {
				setTeam(data);
			},
			onError: (err) => {
				toast.error("Could not fetch team members");
			},
		}
	);

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
		// deleteMember({ catId: teamId, id: selectedId });
		deleteMember({ catId: teamId, id: selectedId });
	};

	return (
		<>
			<div className="w-full grid grid-cols-12 z-40 gap-4">
				<div className="col-span-9 bg-white rounded-md h-fit">
					<div className="flex items-center justify-between px-4 mt-3">
						<h5 className="font-medium text-xl">Team Members</h5>

						<div className="flex relative">
							<SearchInput
								placeholder="Search by name, role, or team..."
								value={searchTerm}
								onChange={(e) => {
									const value = e.target.value;
									setSearchTerm(value);
									setFilters((prev) => ({ ...prev, search: value }));
									setCurrentPage(1);
								}}
							/>

							<button
								onClick={() => setShowFilter((prev) => !prev)}
								className="bg-pink-100 text-pink-500 px-2 py-1 rounded-md">
								<LuListFilter className="text-pink-500 text-xl" />
							</button>

							<FilterDropdown
								showFilter={showFilter}
								setShowFilter={setShowFilter}
								filters={filters}
								setFilters={setFilters}
								filterConfig={teamFilterConfig}
							/>
						</div>

						<button
							className="rounded-md bg-pink-500 text-white text-xs px-4 py-2"
							onClick={() => {
								setNewItem(true);
								setSelectedId("");
								setTeamId("");
								handleTeamModal();
							}}>
							Add
						</button>
					</div>

					{/* Rest of your component remains the same */}
					<Table width="full">
						<TableHeaderRow className="grid grid-cols-7">
							{header.map(({ label }, index) => {
								return (
									<TableHeader
										className={`${
											label.toLowerCase() === "name" ? "col-span-2" : ""
										}`}
										key={index}>
										{label}
									</TableHeader>
								);
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={isLoading}>
							{team
								?.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage
								)
								.map(
									(
										{
											_id,
											image,
											name,
											role,
											isLeader,

											team,
											teamCategory,
											updatedAt,
											createdAt,
										},
										index
									) => {
										return (
											<TableDataRow
												onClick={() => {
													setSelectedId(_id);
													setTeamId(
														teamCategory?._id ||
															(typeof team === "string" ? team : team?._id) ||
															""
													);
													handleTeamModal();
													setNewItem(false);
												}}
												key={index}
												className="grid grid-cols-7 px-4 py-3 bg-white group relative">
												<TableData className="flex gap-2 items-center col-span-2">
													{image && (
														<img
															className="w-4 h-4 rounded-full"
															src={image}
															alt={name}
														/>
													)}
													<span>{name}</span>
												</TableData>
												<TableData className="ml-3">
													{isLeader ? "Yes" : "No"}
												</TableData>
												<TableData>{teamCategory?.name || "—"}</TableData>
												<TableData>{role}</TableData>
												<TableData>
													{moment(updatedAt).format("DD MMM, YYYY")}
												</TableData>
												<TableData>
													{moment(createdAt).format("DD MMM, YYYY")}
												</TableData>
											</TableDataRow>
										);
									}
								)}
						</TableBody>
						<Pagination
							totalItems={team.length}
							itemsPerPage={itemsPerPage}
							currentPage={currentPage}
							onPageChange={setCurrentPage}
						/>
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
