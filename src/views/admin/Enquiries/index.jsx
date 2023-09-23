import React, { useState } from "react";
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

const Enquiries = () => {
	const [enquiries, setEnquiries] = useState([]);
	const { isLoading } = useQuery("enquiries", getEnquiries, {
		onSuccess: (data) => {
			setEnquiries(data);
		},
		onError: () => {
			toast.error("Error Fetching Enquiries");
		},
	});

	return (
		<>
			<div className="w-full z-40 bg-white rounded-md">
				<div className="flex items-center justify-between px-4 mt-3">
					<h5 className="font-medium text-xl">Enquiries</h5>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-[150px_150px_1fr_100px] gap-x-4">
						{header.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{enquiries.map(
							({ _id, fullName, email, description, createdAt }, index) => {
								return (
									<TableDataRow
										key={index}
										className="grid grid-cols-[150px_150px_1fr_100px] px-4 py-3 gap-x-4 bg-white">
										<TableData>
											<span>{fullName}</span>
										</TableData>
										<TableData>{email}</TableData>
										<TableData noTruncate>{description}</TableData>

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
			<ToastContainer />
		</>
	);
};

export default Enquiries;
