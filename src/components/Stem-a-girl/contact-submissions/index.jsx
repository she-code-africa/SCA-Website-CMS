import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";

import React, { useState, useEffect } from "react";
import moment from "moment";
import { sagEnquiries } from "utils/headers";
import { ToastContainer, toast } from "react-toastify";
import SAGEnquiriesModal from "./SAGEnquiriesModal";
import { useQuery } from "react-query";
import { getSAGEnquiries } from "services";

const ContactSubmissions = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedId, setSelectedId] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
	const [enquiryData, setEnquiryData] = useState([]);

	const handleEnquriesModal = () => {
		setIsEnquiryModalOpen(!isEnquiryModalOpen);
	};

	const [showFilter, setShowFilter] = useState(false);
	const [filters, setFilters] = useState({
		search: "",
		status: "",
		sortBy: "",
	});
	const itemsPerPage = 10;
	const dummy = [
		{
			_id: "ijkska",
			fullName: "Anna John",
			email: "chji@gmail.com",
			description: "something is going on",
			status: "Open",
			updatedAt: "2025-7-5",
			createdAt: "2025-6-5",
		},
	];

	const { isLoading: loading } = useQuery("enquiries", getSAGEnquiries, {
		onSuccess: (data) => {
			console.log(data);
			setEnquiryData(data.data.data);
		},
		onError: () => {
			toast.error("Error Fetching Enquiries");
		},
	});

	return (
		<>
			<div className="w-full z-40 bg-white rounded-md shadow-lg">
				<div className="flex flex-col px-4 py-6 pb-2">
					<h5 className="font-medium text-xl text-slate-700">
						Stem A Girl Enquiries
					</h5>

					<Table width="full">
						<TableHeaderRow className="grid grid-cols-6 gap-x-4">
							{sagEnquiries.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={loading}>
							{enquiryData.length > 0 ? (
								enquiryData.map(
									({
										_id,
										fullName,
										email,
										description,
										status,
										updatedAt,
										createdAt,
									}) => (
										<TableDataRow
											key={_id}
											className="grid grid-cols-6 px-4 py-3 gap-x-4 bg-white hover:bg-gray-50"
											onClick={() => {
												setSelectedId(_id);
												// handleEnquriesModal();
											}}>
											<TableData>
												<span>{fullName}</span>
											</TableData>
											<TableData>{email}</TableData>
											<TableData noTruncate>
												<span
													className="block truncate max-w-xs"
													title={description}>
													{description}
												</span>
											</TableData>
											<TableData noTruncate>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														status === "open"
															? "bg-blue-100 text-blue-800"
															: status === "closed"
																? "bg-gray-100 text-gray-800"
																: status === "resolved"
																	? "bg-green-100 text-green-800"
																	: "bg-yellow-100 text-yellow-800"
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
									),
								)
							) : (
								<TableDataRow className="grid grid-cols-6 px-4 py-8 gap-x-4 bg-white">
									<TableData className="col-span-6 text-center text-gray-500">
										{loading
											? "Loading..."
											: "No enquiries found matching your criteria"}
									</TableData>
								</TableDataRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<SAGEnquiriesModal
				isOpen={isEnquiryModalOpen}
				id={selectedId}
				handleModal={() => setIsEnquiryModalOpen(false)}
				canDelete
			/>

			<ToastContainer />
		</>
	);
};

export default ContactSubmissions;
