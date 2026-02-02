import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
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
import SearchAndFilter from "components/Inputs/SearchAndFilter/SearchAndFilter";
import useSearchAndFilter from "hooks/useSearchAndFilter";

// Import paths if available, otherwise define locally
import { paths } from "utils"; // Assuming this exists

const VolunteerList = () => {
	const [volunteers, setVolunteers] = useState([]);
	const [selectedId, setSelectedId] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
	const itemsPerPage = 10;

	// Filter configuration for volunteers
	const volunteerFilterConfig = [
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

	// Use the custom hook for search and filter management
	const {
		filters,
		debouncedFilters,
		showFilter,
		handleSearchChange,
		setShowFilter,
		updateFilters,
		clearAllFilters,
	} = useSearchAndFilter(
		{
			search: "",
			status: "",
			volunteerRole: "",
			sortBy: ""
		},
		300 // 300ms debounce delay
	);

	const { isLoading } = useQuery("volunteers", getVolunteerRequests, {
		onSuccess: (data) => {
			setVolunteers(data);
		},
		onError: () => {
			toast.error("Error Fetching Volunteers");
		},
	});

	// Filtered and sorted volunteers
	const filteredVolunteers = useMemo(() => {
		let filtered = [...volunteers];

		// Apply search filter
		if (debouncedFilters.search) {
			const searchTerm = debouncedFilters.search.toLowerCase();
			filtered = filtered.filter(volunteer =>
				volunteer.fullname?.toLowerCase().includes(searchTerm) ||
				volunteer.email?.toLowerCase().includes(searchTerm) ||
				volunteer.currentRole?.toLowerCase().includes(searchTerm) ||
				volunteer.purpose?.toLowerCase().includes(searchTerm) ||
				volunteer.volunteerRole?.toLowerCase().includes(searchTerm)
			);
		}

		// Apply status filter
		if (debouncedFilters.status) {
			filtered = filtered.filter(volunteer => volunteer.status === debouncedFilters.status);
		}

		// Apply volunteer role filter
		if (debouncedFilters.volunteerRole) {
			filtered = filtered.filter(volunteer => volunteer.volunteerRole === debouncedFilters.volunteerRole);
		}

		// Apply sorting
		if (debouncedFilters.sortBy) {
			filtered.sort((a, b) => {
				const aValue = a[debouncedFilters.sortBy];
				const bValue = b[debouncedFilters.sortBy];
				
				if (debouncedFilters.sortBy === "createdAt" || debouncedFilters.sortBy === "updatedAt") {
					return new Date(bValue) - new Date(aValue); // Newest first
				}
				
				if (typeof aValue === "string" && typeof bValue === "string") {
					return aValue.localeCompare(bValue);
				}
				
				return 0;
			});
		}

		return filtered;
	}, [volunteers, debouncedFilters]);

	// Reset current page when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [debouncedFilters]);

	const handleVolunteerModal = () => {
		setIsVolunteerModalOpen(!isVolunteerModalOpen);
	};

	const handleFilterClear = () => {
		clearAllFilters(volunteerFilterConfig);
	};

	// Calculate active filters count for badge
	const activeFilterCount = volunteerFilterConfig.filter(
		config => filters[config.key] && filters[config.key] !== ""
	).length;

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
						{/* Header with Title, Search/Filter, and Add Button */}
						<div className="flex flex-wrap items-center justify-between">
							<div className="w-full sm:w-auto mb-3 sm:mb-0">
								<h3 className={"font-semibold text-lg text-slate-700"}>
									Volunteer Requests
								</h3>
							</div>
							
							{/* Right-aligned Controls: Search/Filter + Add Button */}
							<div className="flex items-center gap-3 w-full sm:w-auto">
								<SearchAndFilter
									searchPlaceholder="Search volunteers..."
									searchValue={filters.search}
									onSearchChange={(e) => handleSearchChange(e.target.value)}
									showFilter={showFilter}
									setShowFilter={setShowFilter}
									filters={filters}
									setFilters={updateFilters}
									filterConfig={volunteerFilterConfig}
									onFilterClear={handleFilterClear}
									className="flex-grow sm:flex-grow-0"
								/>
								
								{/* Add Volunteer Button */}
								<Link
									to={paths?.addVolunteer || "/admin/volunteers/add"} // Adjust path as needed
									className="rounded-md bg-pink-500 hover:bg-pink-600 text-white text-xs px-4 py-2 transition-colors whitespace-nowrap flex-shrink-0 inline-flex items-center justify-center"
								>
									<svg 
										className="w-4 h-4 mr-1" 
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path 
											strokeLinecap="round" 
											strokeLinejoin="round" 
											strokeWidth={2} 
											d="M12 4v16m8-8H4" 
										/>
									</svg>
									Add Volunteer
								</Link>
							</div>
						</div>
						
						{/* Filter Summary */}
						{activeFilterCount > 0 && (
							<div className="px-4 mt-3 mb-2">
								<div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 text-sm px-3 py-1.5 rounded-md">
									<span className="font-medium">{filteredVolunteers.length} results</span>
									<span className="mx-2">•</span>
									<span>Filtered by: {activeFilterCount} filter(s)</span>
									<button
										onClick={handleFilterClear}
										className="ml-2 text-pink-600 hover:text-pink-800 text-xs font-medium"
									>
										Clear all
									</button>
								</div>
							</div>
						)}
						
						{/* Quick filter status */}
						{(filters.search || filters.status || filters.volunteerRole || filters.sortBy) && (
							<div className="px-4 text-sm text-gray-600 mt-1">
								Showing {filteredVolunteers.length} of {volunteers.length} volunteers
								{filters.search && ` matching "${filters.search}"`}
								{filters.status && ` with status "${filters.status}"`}
								{filters.volunteerRole && ` for role "${filters.volunteerRole}"`}
								{filters.sortBy && ` sorted by ${filters.sortBy}`}
							</div>
						)}
					</div>
					
					{/* Table */}
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
												key={_id}
												className="grid grid-cols-7 px-4 py-3 gap-x-4 bg-white hover:bg-gray-50 cursor-pointer"
											>
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