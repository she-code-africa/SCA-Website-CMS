import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { getEnquiries } from "services";
import { enquiries as header } from "utils/headers";
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
import Pagination from "components/Pagination";
import EnquiriesModal from "components/Enquiries/EnquiriesModal";
import SearchInput from "components/Inputs/SearchInput";
import FilterDropdown from "components/Inputs/FilterDropdown";
import { LuListFilter } from "react-icons/lu";

const Enquiries = () => {
	const [enquiries, setEnquiries] = useState([]);
	const [selectedId, setSelectedId] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
	const [deleteEnquiry, setDeleteEnquiry] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [filters, setFilters] = useState({
		search: "",
		status: "",
		sortBy: ""
	});
	const itemsPerPage = 10;

	const { isLoading, data } = useQuery("enquiries", getEnquiries, {
		onError: () => {
			toast.error("Error Fetching Enquiries");
		},
	});

	useEffect(() => {
		setEnquiries(data);
	}, [data]);

	// Filter configuration for the FilterDropdown component
	const filterConfig = [
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{ value: "open", label: "Open" },
				{ value: "closed", label: "Closed" },
				// { value: "pending", label: "Pending" },
				// { value: "resolved", label: "Resolved" }
			]
		},
		{
			key: "sortBy",
			label: "Sort By",
			type: "select",
			options: [
				{ value: "createdAt", label: "Date Created" },
				{ value: "updatedAt", label: "Date Updated" },
				{ value: "fullName", label: "Name" },
				{ value: "email", label: "Email" }
			]
		}
	];

	// Filtered and sorted enquiries
	const filteredEnquiries = useMemo(() => {
		if (!enquiries) return [];
		
		let filtered = [...enquiries];

		// Apply search filter
		if (filters.search) {
			const searchTerm = filters.search.toLowerCase();
			filtered = filtered.filter(enquiry =>
				enquiry.fullName?.toLowerCase().includes(searchTerm) ||
				enquiry.email?.toLowerCase().includes(searchTerm) ||
				enquiry.description?.toLowerCase().includes(searchTerm) ||
				enquiry.status?.toLowerCase().includes(searchTerm)
			);
		}

		// Apply status filter
		if (filters.status) {
			filtered = filtered.filter(enquiry => enquiry.status === filters.status);
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
	}, [enquiries, filters]);

	// Reset current page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filters]);

	const handleEnquriesModal = () => {
		setIsEnquiryModalOpen(!isEnquiryModalOpen);
	};

	const handleSearchChange = (e) => {
		setFilters(prev => ({ ...prev, search: e.target.value }));
	};

	const toggleFilter = () => {
		setShowFilter(!showFilter);
	};

	// Get current page data
	const currentEnquiries = filteredEnquiries.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<div className="w-full z-40 bg-white rounded-md shadow-lg">
				<div className="flex justify-between items-center px-4 py-6 pb-2">
					<h5 className="font-medium text-xl text-slate-700">Enquiries</h5>
					
					{/* Search and Filter Controls */}
					<div className="flex items-center justify-center gap-3">
						<SearchInput
							placeholder="Search enquiries..."
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

				{/* Filter Summary */}
				{(filters.search || filters.status || filters.sortBy) && (
					<div className="px-4 pb-2 text-sm text-gray-600 w-64">
						Showing {filteredEnquiries.length} of {enquiries?.length || 0} enquiries
						{filters.search && ` matching "${filters.search}"`}
						{filters.status && ` with status "${filters.status}"`}
						{filters.sortBy && ` sorted by ${filters.sortBy}`}
					</div>
				)}

				<Table width="full">
					<TableHeaderRow className="grid grid-cols-6 gap-x-4">
						{header.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{currentEnquiries.length > 0 ? (
							currentEnquiries.map(
								({
									_id,
									fullName,
									email,
									description,
									status,
									updatedAt,
									createdAt,
								}) => {
									return (
										<TableDataRow
											key={_id}
											className="grid grid-cols-6 px-4 py-3 gap-x-4 bg-white hover:bg-gray-50 cursor-pointer"
											onClick={() => {
												setSelectedId(_id);
												handleEnquriesModal();
											}}>
											<TableData>
												<span>{fullName}</span>
											</TableData>
											<TableData>{email}</TableData>
											<TableData noTruncate>
												<span 
													className="block truncate max-w-xs" 
													title={description}
												>
													{description}
												</span>
											</TableData>
											<TableData noTruncate>
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${
													status === "open" 
														? 'bg-blue-100 text-blue-800' 
														: status === 'closed' 
														? 'bg-gray-100 text-gray-800'
														: status === 'resolved'
														? 'bg-green-100 text-green-800'
														: 'bg-yellow-100 text-yellow-800'
												}`}>
													{status}
												</span>
											</TableData>
											<TableData>
												{moment(createdAt).format("DD MMM, YYYY")}
											</TableData>
											<TableData noTruncate>
												{moment(updatedAt).format("DD MMM, YYYY")}
											</TableData>
										</TableDataRow>
									);
								}
							)
						) : (
							<TableDataRow className="grid grid-cols-6 px-4 py-8 gap-x-4 bg-white">
								<TableData className="col-span-6 text-center text-gray-500">
									{isLoading ? "Loading..." : "No enquiries found matching your criteria"}
								</TableData>
							</TableDataRow>
						)}
					</TableBody>
					
					{filteredEnquiries.length > 0 && (
						<Pagination
							totalItems={filteredEnquiries.length}
							itemsPerPage={itemsPerPage}
							currentPage={currentPage}
							onPageChange={setCurrentPage}
						/>
					)}
				</Table>
			</div>

			<EnquiriesModal
				isOpen={isEnquiryModalOpen}
				id={selectedId}
				handleModal={() => setIsEnquiryModalOpen(false)}
				canDelete
			/>

			<ToastContainer />
		</>
	);
};

export default Enquiries;