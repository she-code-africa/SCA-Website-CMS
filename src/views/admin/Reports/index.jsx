// import React, { useState, useMemo } from "react";
// import {
// 	TableHeaderRow,
// 	TableHeader,
// 	Table,
// 	TableDataRow,
// 	TableData,
// 	TableBody,
// } from "components/Table/DisplayTable";
// import moment from "moment";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { report as header } from "utils/headers";
// import { getReports } from "services";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ReportModal from "components/Reports/ReportModal";
// import { deleteReport } from "services";
// import DeleteModal from "components/Modal/DeleteModal";
// import SearchInput from "components/Inputs/SearchInput";
// import FilterDropdown from "components/Inputs/FilterDropdown";
// import { LuListFilter } from "react-icons/lu";

// const Reports = () => {
// 	const queryClient = useQueryClient();
// 	const [reports, setReports] = useState([]);
// 	const [selectedId, setSelectedId] = useState("");
// 	const [isReportModalOpen, setIsReportModalOpen] = useState(false);
// 	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// 	const [newItem, setNewItem] = useState();
// 	const [showFilter, setShowFilter] = useState(false);
// 	const [filters, setFilters] = useState({
// 		search: "",
// 		year: "",
// 		sortBy: "",
// 	});

// 	const handleReportModal = () => {
// 		setIsReportModalOpen(!isReportModalOpen);
// 	};

// 	const handleDeleteModal = () => {
// 		setIsDeleteModalOpen(!isDeleteModalOpen);
// 	};

// 	const { mutate } = useMutation(deleteReport, {
// 		onSuccess: () => {
// 			queryClient.invalidateQueries(["reports"]);
// 			toast.success("Report Deleted Successfully");
// 		},
// 		onError: () => {
// 			console.log("error");
// 			toast.error("Could not delete Report");
// 		},
// 	});

// 	const handleDelete = () => {
// 		mutate(selectedId);
// 		handleDeleteModal();
// 	};

// 	const { isLoading } = useQuery("reports", getReports, {
// 		onSuccess: (data) => {
// 			setReports(data);
// 		},
// 		onError: () => {
// 			toast.error("Error fetching Reports");
// 		},
// 	});

// 	// Generate unique years from reports data for filter options
// 	const yearOptions = useMemo(() => {
// 		if (!reports) return [];
// 		const years = [...new Set(reports.map((report) => report.year))].sort(
// 			(a, b) => b - a
// 		);
// 		return years.map((year) => ({
// 			value: year.toString(),
// 			label: year.toString(),
// 		}));
// 	}, [reports]);

// 	// Filter configuration for the FilterDropdown component
// 	const filterConfig = [
// 		{
// 			key: "year",
// 			label: "Year",
// 			type: "select",
// 			options: yearOptions,
// 		},
// 		{
// 			key: "sortBy",
// 			label: "Sort By",
// 			type: "select",
// 			options: [
// 				{ value: "year", label: "Year" },
// 				{ value: "createdAt", label: "Date Created" },
// 				{ value: "updatedAt", label: "Date Updated" },
// 			],
// 		},
// 	];

// 	// Filtered and sorted reports
// 	const filteredReports = useMemo(() => {
// 		if (!reports) return [];

// 		let filtered = [...reports];

// 		// Apply search filter
// 		if (filters.search) {
// 			const searchTerm = filters.search.toLowerCase();
// 			filtered = filtered.filter(
// 				(report) =>
// 					report.year?.toString().includes(searchTerm) ||
// 					report.link?.toLowerCase().includes(searchTerm)
// 			);
// 		}

// 		// Apply year filter
// 		if (filters.year) {
// 			filtered = filtered.filter(
// 				(report) => report.year?.toString() === filters.year
// 			);
// 		}

// 		// Apply sorting
// 		if (filters.sortBy) {
// 			filtered.sort((a, b) => {
// 				const aValue = a[filters.sortBy];
// 				const bValue = b[filters.sortBy];

// 				if (filters.sortBy === "year") {
// 					return bValue - aValue; // Newest year first
// 				}

// 				if (filters.sortBy === "createdAt" || filters.sortBy === "updatedAt") {
// 					return new Date(bValue) - new Date(aValue); // Newest first
// 				}

// 				return 0;
// 			});
// 		} else {
// 			// Default sort by year (newest first)
// 			filtered.sort((a, b) => b.year - a.year);
// 		}

// 		return filtered;
// 	}, [reports, filters]);

// 	const handleSearchChange = (e) => {
// 		setFilters((prev) => ({ ...prev, search: e.target.value }));
// 	};

// 	const toggleFilter = () => {
// 		setShowFilter(!showFilter);
// 	};

// 	// // Get current page data
// 	// const currentReports = filteredReports.slice(
// 	// 	(currentPage - 1) * itemsPerPage,
// 	// 	currentPage * itemsPerPage
// 	// );

// 	return (
// 		<div className="w-full z-40 bg-white rounded-md shadow-lg">
// 			<div className="flex items-center justify-between px-4 pt-6 pb-2">
// 				<h5 className="font-medium text-xl text-slate-700">Annual Reports</h5>

// 				<div className="flex items-center gap-3">
// 					{/* Search and Filter Controls */}
// 					<SearchInput
// 						placeholder="Search reports..."
// 						value={filters.search}
// 						onChange={handleSearchChange}
// 					/>

// 					<div className="relative">
// 						<button
// 							onClick={toggleFilter}
// 							className={`p-2 rounded-md border ${
// 								showFilter ? "bg-pink-500 text-white" : "bg-white text-pink-500"
// 							} border-pink-500 hover:bg-pink-50 transition-colors`}>
// 							<LuListFilter size={18} />
// 						</button>

// 						<FilterDropdown
// 							showFilter={showFilter}
// 							setShowFilter={setShowFilter}
// 							filters={filters}
// 							setFilters={setFilters}
// 							filterConfig={filterConfig}
// 						/>
// 					</div>

// 					<button
// 						className="rounded-md bg-pink-500 text-white text-xs px-4 py-2"
// 						onClick={() => {
// 							setNewItem(true);
// 							setSelectedId("");
// 							handleReportModal();
// 						}}>
// 						Add
// 					</button>
// 				</div>
// 			</div>

// 			{/* Filter Summary */}
// 			{(filters.search || filters.year || filters.sortBy) && (
// 				<div className="px-4 pb-2 text-sm text-gray-600">
// 					Showing {filteredReports.length} of {reports?.length || 0} reports
// 					{filters.search && ` matching "${filters.search}"`}
// 					{filters.year && ` from year ${filters.year}`}
// 					{filters.sortBy && ` sorted by ${filters.sortBy}`}
// 				</div>
// 			)}

// 			<Table width="full">
// 				<TableHeaderRow className="grid grid-cols-4">
// 					{header.map(({ label }, index) => {
// 						return <TableHeader key={index}>{label}</TableHeader>;
// 					})}
// 					<TableHeader></TableHeader>
// 				</TableHeaderRow>
// 				<TableBody loading={isLoading}>
// 					{filteredReports.length > 0 ? (
// 						filteredReports.map(
// 							({ _id, link, year, createdAt, updatedAt }, index) => {
// 								return (
// 									<TableDataRow
// 										onClick={() => {
// 											setSelectedId(_id);
// 											handleReportModal();
// 											setNewItem(false);
// 										}}
// 										key={index}
// 										className="grid grid-cols-4 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer">
// 										<TableData>
// 											<span className="flex items-center gap-2 font-medium text-pink-600">
// 												{year}
// 											</span>
// 										</TableData>
// 										<TableData>
// 											<span
// 												className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
// 												title={link}>
// 												{link}
// 											</span>
// 										</TableData>
// 										<TableData>
// 											{moment(updatedAt).format("DD MMM, YYYY")}
// 										</TableData>
// 										<TableData>
// 											{moment(createdAt).format("DD MMM, YYYY")}
// 										</TableData>
// 									</TableDataRow>
// 								);
// 							}
// 						)
// 					) : (
// 						<TableDataRow className="grid grid-cols-4 px-4 py-8 bg-white">
// 							<TableData className="col-span-4 text-center text-gray-500">
// 								{isLoading
// 									? "Loading..."
// 									: "No reports found matching your criteria"}
// 							</TableData>
// 						</TableDataRow>
// 					)}
// 				</TableBody>
// 			</Table>

// 			{isDeleteModalOpen && (
// 				<DeleteModal
// 					title="Delete Report"
// 					handleDelete={handleDelete}
// 					isOpen={isDeleteModalOpen}
// 					handleModal={handleDeleteModal}
// 				/>
// 			)}
// 			{isReportModalOpen && (
// 				<ReportModal
// 					handleDeleteModal={() => setIsDeleteModalOpen(true)}
// 					isOpen={isReportModalOpen}
// 					handleModal={handleReportModal}
// 					id={selectedId}
// 					newItem={newItem}
// 				/>
// 			)}
// 			<ToastContainer />
// 		</div>
// 	);
// };

// export default Reports;
