import React, { useState } from "react";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getReportsViews } from "services";
import { ToastContainer, toast } from "react-toastify";
import { FaDownload } from "react-icons/fa6";

const AnnualReportLog = () => {
	const queryClient = useQueryClient();
	const [details, setDetails] = useState([]);
	const { isLoading } = useQuery("reports", getReportsViews, {
		onSuccess: (data) => {
			console.log("REPORT===>", data);
			setDetails(data);
		},
		onError: () => {
			toast.error("Error fetching Reports");
		},
	});

	const header = [
		{ label: "First Name" },
		{ label: "Last Name" },
		{ label: "Email Address" },
	];
	return (
		<div className="w-full z-40 bg-white rounded-md shadow-lg">
			<div className="flex items-center justify-between px-4 pt-6 pb-2">
				<article className="flex items-center gap-3 text-pink-500 text-xl">
					<h5 className="font-medium text-xl text-slate-700">
						Annual Report Views
					</h5>
					<span>
						<FaDownload />
					</span>

					{isLoading
						? 0
						: `${details.length > 9 ? details.length : `0${details.length}`}`}
				</article>
			</div>

			<Table width="full">
				<TableHeaderRow className="grid grid-cols-4">
					{header.map(({ label }, index) => {
						return <TableHeader key={index}>{label}</TableHeader>;
					})}
					<TableHeader></TableHeader>
				</TableHeaderRow>

				<TableBody loading={isLoading}>
					{details.map(({ firstname, lastname, email }, idx) => (
						<TableDataRow
							key={idx}
							className="grid grid-cols-4 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer">
							<TableData>
								<span className="flex items-center gap-2 font-medium text-pink-600">
									{firstname}
								</span>
							</TableData>
							<TableData>
								<span className="flex items-center gap-2 font-medium text-pink-600">
									{lastname}
								</span>
							</TableData>
							<TableData>
								<span className="flex items-center gap-2 font-medium text-pink-600">
									{email}
								</span>
							</TableData>
						</TableDataRow>
					))}
				</TableBody>
			</Table>
			<ToastContainer />
		</div>
	);
};

export default AnnualReportLog;
