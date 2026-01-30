import {
  TableHeaderRow,
  TableHeader,
  Table,
  TableDataRow,
  TableData,
  TableBody,
} from "components/Table/DisplayTable";
import React, { useState, useEffect } from "react";
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
import SearchAndFilter from "components/Inputs/SearchAndFilter/SearchAndFilter";
import useSearchAndFilter from "hooks/useSearchAndFilter";

const TeamList = () => {
  const [selectedId, setSelectedId] = useState();
  const [teamId, setTeamId] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Configuration for team member filters
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
      isLeader: "",
      state: "",
      team: "",
    },
    300, // 300ms debounce delay
    (latestFilters) => {
      // Optional callback when filters change after debounce
      console.log("Filters changed (debounced):", latestFilters);
    }
  );

  // Debug: Log filter changes
  useEffect(() => {
    console.log("Current filters in Teams.js:", filters);
    console.log("Current debounced filters in Teams.js:", debouncedFilters);
  }, [filters, debouncedFilters]);

  // Build query params from filters
  const buildQueryParams = (filters) => {
    const params = new URLSearchParams();
    console.log("Building query params with:", filters); // Debug
    
    if (filters.search?.trim()) {
      params.append("search", filters.search.trim());
      console.log("Added search param:", filters.search.trim());
    }
    if (filters.isLeader && filters.isLeader !== "") {
      params.append("isLeader", filters.isLeader);
      console.log("Added isLeader param:", filters.isLeader);
    }
    if (filters.state && filters.state !== "") {
      params.append("state", filters.state);
      console.log("Added state param:", filters.state);
    }
    if (filters.team && filters.team !== "") {
      params.append("team", filters.team);
      console.log("Added team param:", filters.team);
    }
    
    console.log("Final query string:", params.toString());
    return params.toString();
  };

  // Fetch team members with debounced filters
  const { data: team = [], isLoading, error, refetch } = useQuery(
    ["team", debouncedFilters, currentPage],
    async () => {
      console.log("Fetching data with filters:", debouncedFilters); // Debug
      const query = buildQueryParams(debouncedFilters);
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/teams/members?${query}`
      );
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();
      console.log("API Response data:", data); // Debug
      return data.data || [];
    },
    {
      keepPreviousData: true,
      onError: (err) => {
        console.error("Fetch error details:", err);
        toast.error("Could not fetch team members");
      },
    }
  );

  // Handle filter clear
  const handleFilterClear = () => {
    console.log("Clearing filters from Teams.js");
    clearAllFilters(teamFilterConfig);
  };

  // Manual refetch for debugging
  const handleManualRefetch = () => {
    console.log("Manually refetching data...");
    refetch();
  };

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

  // Calculate paginated data
  const paginatedTeam = team.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate active filters for display
  const activeFilters = teamFilterConfig.filter(
    config => filters[config.key] && filters[config.key] !== ""
  );

  return (
    <>
      <div className="w-full grid grid-cols-12 z-40 gap-4">
        <div className="col-span-9 bg-white rounded-md h-fit">
          {/* Header Section with Search, Filter, and Add Button */}
          <div className="flex items-center justify-between px-4 mt-3 mb-4">
            <h5 className="font-medium text-xl">Team Members</h5>

            {/* Right-aligned Search, Filter, and Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Debug info */}
              {activeFilters.length > 0 && (
                <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="font-medium">Active filters:</span>
                  {activeFilters.map(filter => {
                    const option = teamFilterConfig
                      .find(c => c.key === filter.key)
                      ?.options?.find(o => o.value === filters[filter.key]);
                    return (
                      <span key={filter.key} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                        {option?.label || filters[filter.key]}
                      </span>
                    );
                  })}
                </div>
              )}

              <SearchAndFilter
                searchPlaceholder="Search by name, role, or team..."
                searchValue={filters.search}
                onSearchChange={(e) => handleSearchChange(e.target.value)}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                filters={filters}
                setFilters={updateFilters}
                filterConfig={teamFilterConfig}
                onFilterClear={handleFilterClear}
              />

              <button
                className="rounded-md bg-pink-500 hover:bg-pink-600 text-white text-xs px-4 py-2 transition-colors whitespace-nowrap"
                onClick={() => {
                  setNewItem(true);
                  setSelectedId("");
                  setTeamId("");
                  handleTeamModal();
                }}
              >
                Add Member
              </button>

              {/* Debug button (remove in production) */}
              <button
                className="hidden rounded-md bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 transition-colors whitespace-nowrap"
                onClick={handleManualRefetch}
                title="Debug: Manual refetch"
              >
                ↻
              </button>
            </div>
          </div>

          {/* Filter Status Indicator */}
          {activeFilters.length > 0 && (
            <div className="px-4 mb-3">
              <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 text-sm px-3 py-1.5 rounded-md">
                <span className="font-medium">{team.length} results</span>
                <span className="mx-2">•</span>
                <span>Filtered by: {activeFilters.map(f => f.key).join(", ")}</span>
                <button
                  onClick={handleFilterClear}
                  className="ml-2 text-pink-600 hover:text-pink-800 text-xs font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

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
          {/* Table */}
          <Table width="full">
            <TableHeaderRow className="grid grid-cols-7">
              {header.map(({ label }, index) => {
                return (
                  <TableHeader
                    className={`${
                      label.toLowerCase() === "name" ? "col-span-2" : ""
                    }`}
                    key={index}
                  >
                    {label}
                  </TableHeader>
                );
              })}
              <TableHeader></TableHeader>
            </TableHeaderRow>
            
            <TableBody loading={isLoading}>
              {error ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-red-500">
                    Failed to load team members
                  </td>
                </tr>
              ) : paginatedTeam.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No team members found
                    {activeFilters.length > 0 && (
                      <div className="mt-2">
                        <button
                          onClick={handleFilterClear}
                          className="text-pink-500 hover:text-pink-700 text-sm font-medium"
                        >
                          Try clearing filters
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedTeam.map(
                  (
                    {
                      _id,
                      image,
                      name,
                      role,
                      isLeader,
                      team: teamName,
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
                              (typeof teamName === "string" ? teamName : teamName?._id) ||
                              ""
                          );
                          handleTeamModal();
                          setNewItem(false);
                        }}
                        key={_id}
                        className="grid grid-cols-7 px-4 py-3 bg-white group relative hover:bg-gray-50 cursor-pointer"
                      >
                        <TableData className="flex gap-2 items-center col-span-2">
                          {image && (
                            <img
                              className="w-8 h-8 rounded-full object-cover"
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
                )
              )}
            </TableBody>
            
            {team.length > 0 && (
              <Pagination
                totalItems={team.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </Table>
        </div>

        {/* Team Category Sidebar */}
        <div className="col-span-3">
          <TeamCategory />
        </div>
      </div>

      {/* Modals */}
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