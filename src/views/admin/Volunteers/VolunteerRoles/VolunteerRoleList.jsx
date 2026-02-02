// views/admin/Volunteers/VolunteerRoles/VolunteerRoleList.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { Link } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { volunteerRoles as header } from "utils/headers";
import { paths } from "utils";

import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody
} from "components/Table/DisplayTable";

import Pagination from "components/Pagination";
import SearchAndFilter from "components/Inputs/SearchAndFilter/SearchAndFilter";
import useSearchAndFilter from "hooks/useSearchAndFilter";

import { getVolunteerRoles, deleteVolunteerRole } from "services/index";

const VolunteerRoleList = () => {
	const [roles, setRoles] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const roleFilterConfig = [
		{
			key: "sortBy",
			label: "Sort By",
			type: "select",
			options: [
				{ value: "updatedAt", label: "Date Updated" },
				{ value: "createdAt", label: "Date Created" },
				{ value: "name", label: "Role Name" }
			]
		}
	];

	const {
		filters,
		debouncedFilters,
		showFilter,
		handleSearchChange,
		setShowFilter,
		updateFilters,
		clearAllFilters
	} = useSearchAndFilter({ search: "", sortBy: "" }, 300);

	const { isLoading } = useQuery("volunteerRoles", getVolunteerRoles, {
		onSuccess: (data) => setRoles(Array.isArray(data) ? data : []),
		onError: () => toast.error("Error fetching volunteer roles")
	});

	const delMutation = useMutation({
		mutationFn: (id) => deleteVolunteerRole(id),
		onSuccess: async () => {
			toast.success("Role deleted");
			const refreshed = await getVolunteerRoles();
			setRoles(Array.isArray(refreshed) ? refreshed : []);
		},
		onError: () => toast.error("Failed to delete role")
	});

	const filteredRoles = useMemo(() => {
		let filtered = [...roles];

		if (debouncedFilters.search) {
			const s = debouncedFilters.search.toLowerCase();
			filtered = filtered.filter((r) => {
				const skillsText = Array.isArray(r.skills) ? r.skills.join(" ") : "";
				return (
					r?.name?.toLowerCase().includes(s) ||
					r?.description?.toLowerCase().includes(s) ||
					skillsText.toLowerCase().includes(s)
				);
			});
		}

		if (debouncedFilters.sortBy) {
			const key = debouncedFilters.sortBy;
			filtered.sort((a, b) => {
				const av = a?.[key];
				const bv = b?.[key];
				if (key === "createdAt" || key === "updatedAt")
					return new Date(bv) - new Date(av);
				if (typeof av === "string" && typeof bv === "string")
					return av.localeCompare(bv);
				return 0;
			});
		}

		return filtered;
	}, [roles, debouncedFilters]);

	useEffect(() => setCurrentPage(1), [debouncedFilters]);

	const currentRoles = filteredRoles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const activeFilterCount = roleFilterConfig.filter(
		(c) => filters[c.key] && filters[c.key] !== ""
	).length;

	const handleFilterClear = () => clearAllFilters(roleFilterConfig);

	return (
		<>
			<div className="flex w-full px-4">
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
					<div className="rounded-t mb-0 px-4 py-3 border-0 pb-0">
						<div className="flex flex-wrap items-center justify-between">
							<div className="w-full sm:w-auto mb-3 sm:mb-0">
								<h3 className="font-semibold text-lg text-slate-700">
									Volunteer Roles
								</h3>
							</div>

							<div className="flex items-center gap-3 w-full sm:w-auto">
								<SearchAndFilter
									searchPlaceholder="Search roles (name, skills, description)..."
									searchValue={filters.search}
									onSearchChange={(e) => handleSearchChange(e.target.value)}
									showFilter={showFilter}
									setShowFilter={setShowFilter}
									filters={filters}
									setFilters={updateFilters}
									filterConfig={roleFilterConfig}
									onFilterClear={handleFilterClear}
									className="flex-grow sm:flex-grow-0"
								/>

								<Link
									to={paths.addVolunteerRole}
									className="rounded-md bg-pink-500 hover:bg-pink-600 text-white text-xs px-4 py-2 transition-colors whitespace-nowrap inline-flex items-center justify-center">
									+ Add Role
								</Link>
							</div>
						</div>

						{activeFilterCount > 0 && (
							<div className="px-4 mt-3 mb-2">
								<div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 text-sm px-3 py-1.5 rounded-md">
									<span className="font-medium">
										{filteredRoles.length} results
									</span>
									<span className="mx-2">•</span>
									<span>Filtered by: {activeFilterCount} filter(s)</span>
									<button
										onClick={handleFilterClear}
										className="ml-2 text-pink-600 hover:text-pink-800 text-xs font-medium">
										Clear all
									</button>
								</div>
							</div>
						)}
					</div>

					<Table width="full">
						{/* 5 headers + actions => grid-cols-6 */}
						<TableHeaderRow className="grid grid-cols-6 gap-x-4">
							{header.map(({ label }, index) => (
								<TableHeader key={index}>{label}</TableHeader>
							))}
							<TableHeader>Actions</TableHeader>
						</TableHeaderRow>

						<TableBody loading={isLoading}>
							{currentRoles.length > 0 ? (
								currentRoles.map((role) => (
									<TableDataRow
										key={role._id}
										className="grid grid-cols-6 px-4 py-3 gap-x-4 bg-white hover:bg-gray-50">
										<TableData>
											{role.image ? (
												<img
													src={role.image}
													alt={role.name}
													className="h-10 w-10 rounded-md object-cover border border-slate-200"
												/>
											) : (
												<div className="h-10 w-10 rounded-md bg-slate-100 border border-slate-200" />
											)}
										</TableData>

										<TableData className="font-semibold text-slate-700">
											{role.name}
										</TableData>

										<TableData>
											{Array.isArray(role.skills) && role.skills.length > 0 ? (
												<div className="flex flex-wrap gap-1">
													{role.skills.slice(0, 2).map((s, idx) => (
														<span
															key={idx}
															className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
															{s}
														</span>
													))}
													{role.skills.length > 2 && (
														<span className="text-xs text-slate-500">
															+{role.skills.length - 2}
														</span>
													)}
												</div>
											) : (
												<span className="text-xs text-slate-500">—</span>
											)}
										</TableData>

										<TableData className="truncate">
											{role.description || "—"}
										</TableData>

										<TableData>
											{moment(role.updatedAt).format("DD MMM, YYYY")}
										</TableData>

										<TableData>
											<div className="flex justify-end gap-3">
												<Link
													to={`${paths.editVolunteerRole}/${role._id}`}
													className="text-xs font-semibold text-pink-600 hover:text-pink-800">
													Edit
												</Link>
												<button
													type="button"
													onClick={() => delMutation.mutate(role._id)}
													className="text-xs font-semibold text-red-600 hover:text-red-800">
													Delete
												</button>
											</div>
										</TableData>
									</TableDataRow>
								))
							) : (
								<TableDataRow className="grid grid-cols-6 px-4 py-8 gap-x-4 bg-white">
									<TableData className="col-span-6 text-center text-gray-500">
										{isLoading ? "Loading..." : "No volunteer roles found"}
									</TableData>
								</TableDataRow>
							)}
						</TableBody>

						{filteredRoles.length > 0 && (
							<Pagination
								totalItems={filteredRoles.length}
								itemsPerPage={itemsPerPage}
								currentPage={currentPage}
								onPageChange={setCurrentPage}
							/>
						)}
					</Table>
				</div>
			</div>

			<ToastContainer />
		</>
	);
};

export default VolunteerRoleList;
