import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { volunteer as header } from "utils/headers";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVolunteerRequests } from "services";
import Pagination from "components/Pagination";
import VolunteerModal from "components/Volunteers/VolunteerModal";
import SearchInput from "components/Inputs/SearchInput";
import FilterDropdown from "components/Inputs/FilterDropdown";
import { LuListFilter } from "react-icons/lu";

const VolunteerList = () => {
	const [volunteers, setVolunteers] = useState([]);
	const [selectedId, setSelectedId] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [filters, setFilters] = useState({
		search: "",
		status: "",
		volunteerRole: "",
		sortBy: ""
	});
	const itemsPerPage = 10;

	const { isLoading } = useQuery("volunteers", getVolunteerRequests, {
		onSuccess: (data) => {
			setVolunteers(data);
		},
		onError: () => {
			toast.error("Error Fetching Volunteers");
		},
	});

	// Filter configuration for the FilterDropdown component
	const filterConfig = [
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{ value: "Approved", label: "Approved" },
				{ value: "Rejected", label: "Rejected" },
				{ value: "Pending", label: "Pending" }
			]
		},
		{
			key: "volunteerRole",
			label: "Volunteer Role",
			type: "select",
			options: [
				{ value: "Mentor", label: "Mentor" },
				{ value: "Tutor", label: "Tutor" },
				{ value: "Assistant", label: "Assistant" },
				{ value: "Facilitator", label: "Facilitator" }
			]
		},
		{
			key: "sortBy",
			label: "Sort By",
			type: "select",
			options: [
				{ value: "createdAt", label: "Date Created" },
				{ value: "updatedAt", label: "Date Updated" },
				{ value: "fullname", label: "Name" },
				{ value: "email", label: "Email" }
			]
		}
	];

	// Filtered and sorted volunteers
	const filteredVolunteers = useMemo(() => {
		let filtered = [...volunteers];

		// Apply search filter
		if (filters.search) {
			const searchTerm = filters.search.toLowerCase();
			filtered = filtered.filter(volunteer =>
				volunteer.fullname?.toLowerCase().includes(searchTerm) ||
				volunteer.email?.toLowerCase().includes(searchTerm) ||
				volunteer.currentRole?.toLowerCase().includes(searchTerm) ||
				volunteer.purpose?.toLowerCase().includes(searchTerm) ||
				volunteer.volunteerRole?.toLowerCase().includes(searchTerm)
			);
		}

		// Apply status filter
		if (filters.status) {
			filtered = filtered.filter(volunteer => volunteer.status === filters.status);
		}

		// Apply volunteer role filter
		if (filters.volunteerRole) {
			filtered = filtered.filter(volunteer => volunteer.volunteerRole === filters.volunteerRole);
		}

		// Apply sorting
		if (filters.sortBy) {
			filtered.sort((a, b) => {
				const aValue = a[filters.sortBy];
				const bValue = b[filters.sortBy];
				
				if (filters.sortBy === "createdAt" || filters.sortBy === "updatedAt") {
					return new Date(bValue) - new Date(aValue); // Newest first
				}
				
				if (typeof aValue === "string" && typeof bValue === "string") {
					return aValue.localeCompare(bValue);
				}
				
				return 0;
			});
		}

		return filtered;
	}, [volunteers, filters]);

	// Reset current page when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [filters]);

	const handleVolunteerModal = () => {
		setIsVolunteerModalOpen(!isVolunteerModalOpen);
	};

	const handleSearchChange = (e) => {
		setFilters(prev => ({ ...prev, search: e.target.value }));
	};

	const toggleFilter = () => {
		setShowFilter(!showFilter);
	};

	// Get current page data
	const currentVolunteers = filteredVolunteers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<div className="flex w-full px-4">
				<div
					className={
						"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
					}>  
					<div className="rounded-t mb-0 px-4 py-3 border-0 pb-0">
						<div className="flex flex-wrap items-center">
							<div className="relative w-full px-2 max-w-full flex justify-between flex-grow flex-1">
								<h3 className={"font-semibold text-lg text-slate-700"}>
									Volunteer Requests
								</h3>
								
								{/* Search and Filter Controls */}
								<div className="flex items-center gap-3">
									<SearchInput
										placeholder="Search volunteers..."
										value={filters.search}
										onChange={handleSearchChange}
									/>
									
									<div className="relative">
										<button
											onClick={toggleFilter}
											className={`p-2 rounded-md border ${showFilter ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'} border-pink-500 hover:bg-pink-50 transition-colors`}
										>
											<LuListFilter size={18} />
										</button>
										
										<FilterDropdown
											showFilter={showFilter}
											setShowFilter={setShowFilter}
											filters={filters}
											setFilters={setFilters}
											filterConfig={filterConfig}
										/>
									</div>
								</div>
							</div>
						</div>
						
						{/* Filter Summary */}
						{(filters.search || filters.status || filters.volunteerRole || filters.sortBy) && (
							<div className="px-2 mt-2 text-sm text-gray-600">
								Showing {filteredVolunteers.length} of {volunteers.length} volunteers
								{filters.search && ` matching "${filters.search}"`}
								{filters.status && ` with status "${filters.status}"`}
								{filters.volunteerRole && ` for role "${filters.volunteerRole}"`}
								{filters.sortBy && ` sorted by ${filters.sortBy}`}
							</div>
						)}
					</div>
					
					<Table width="full">
						<TableHeaderRow className="grid grid-cols-7 gap-x-4">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={isLoading}>
							{currentVolunteers.length > 0 ? (
								currentVolunteers.map(
									(
										{
											fullname,
											email,
											currentRole,
											purpose,
											volunteerRole,
											updatedAt,
											status,
											_id
										},
										index
									) => {
										return (
											<TableDataRow
												onClick={() => {
													setSelectedId(_id);
													handleVolunteerModal();
												}}
												key={index}
												className="grid grid-cols-7 px-4 py-3 gap-x-4 bg-white hover:bg-gray-50 cursor-pointer">
												<TableData>{fullname}</TableData>
												<TableData>{email}</TableData>
												<TableData>{currentRole}</TableData>
												<TableData>{purpose}</TableData>
												<TableData>{volunteerRole}</TableData>
												<TableData>
													<span className={`p-1 rounded-md text-xs ${
														status === "Approved" 
															? 'bg-green-700 text-white' 
															: status === 'Rejected' 
															? 'bg-red-500 text-white' 
															: 'bg-gray-300 text-gray-700'
													}`}>
														{status}
													</span>
												</TableData>
												<TableData>
													{moment(updatedAt).format("DD MMM, YYYY")}
												</TableData>
											</TableDataRow>
										);
									}
								)
							) : (
								<TableDataRow className="grid grid-cols-7 px-4 py-8 gap-x-4 bg-white">
									<TableData className="col-span-7 text-center text-gray-500">
										{isLoading ? "Loading..." : "No volunteers found matching your criteria"}
									</TableData>
								</TableDataRow>
							)}
						</TableBody>
						
						{filteredVolunteers.length > 0 && (
							<Pagination
								totalItems={filteredVolunteers.length}
								itemsPerPage={itemsPerPage}
								currentPage={currentPage}
								onPageChange={setCurrentPage}
							/>
						)}
					</Table>
				</div>
			</div>
			<ToastContainer />
			{isVolunteerModalOpen && (
				<VolunteerModal
					id={selectedId}
					isOpen={isVolunteerModalOpen}
					handleModal={handleVolunteerModal}
					setVolunteers={setVolunteers}
				/>
			)}
		</>
	);
};

export default VolunteerList;