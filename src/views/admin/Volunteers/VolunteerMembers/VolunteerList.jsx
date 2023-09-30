import React, { useState } from "react";
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
import { getVolunteerRequest } from "services";
import Pagination from "components/Pagination";

const VolunteerList = () => {
	const [volunteers, setVolunteers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const { isLoading } = useQuery("volunteers", getVolunteerRequest, {
		onSuccess: (data) => {
			setVolunteers(data);
		},
		onError: () => {
			toast.error("Error Fetching Volunteers");
		},
	});
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
								<h3 className={"font-semibold text-lg  text-slate-700"}>
									Volunteer Requests
								</h3>
							</div>
						</div>
					</div>
					<Table width="full">
						<TableHeaderRow className="grid grid-cols-7 gap-x-4">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={isLoading}>
							{volunteers
								?.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage
								)
								.map(
									(
										{
											fullname,
											email,
											currentRole,
											purpose,
											volunteerRole,
											updatedAt,
											createdAt,
										},
										index
									) => {
										return (
											<TableDataRow
												key={index}
												className="grid grid-cols-7 px-4 py-3 gap-x-4 bg-white">
												<TableData>
													<span>{fullname}</span>
												</TableData>
												<TableData>{email}</TableData>
												<TableData>{currentRole}</TableData>
												<TableData>{purpose}</TableData>
												<TableData>{volunteerRole}</TableData>
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
							totalItems={volunteers.length}
							itemsPerPage={itemsPerPage}
							currentPage={currentPage}
							onPageChange={setCurrentPage}
						/>
					</Table>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};

export default VolunteerList;
