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
import { report as header } from "utils/headers";
import { getReports } from "services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReportModal from "components/Reports/ReportModal";
import { deleteReport, editReport } from "services";
import DeleteModal from "components/Modal/DeleteModal";

const Reports = () => {
	const queryClient = useQueryClient();
	const [reports, setReports] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isReportModalOpen, setIsReportModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();

	const handleReportModal = () => {
		setIsReportModalOpen(!isReportModalOpen);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const { mutate } = useMutation(deleteReport, {
		onSuccess: () => {
			queryClient.invalidateQueries(["reports"]);
			toast.success("Report Deleted Successfully");
			//handleDeleteModal();
		},
		onError: () => {
			console.log("error");
			toast.error("Could not delete Report");
		},
	});

	const handleDelete = () => {
		mutate(selectedId);
		handleDeleteModal();
	};

	const { isLoading } = useQuery("reports", getReports, {
		onSuccess: (data) => {
			setReports(data);
		},
		onError: () => {
			toast.error("Error fetching Reports");
		},
	});
	return (
		<div className="w-full z-40 bg-white rounded-md">
			<div className="flex items-center justify-between px-4 mt-3">
				<h5 className="font-medium text-xl">Annual Reports</h5>
				<button
					className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
					onClick={() => {
						setNewItem(true);
						setSelectedId("");
						handleReportModal();
					}}>
					Add
				</button>
			</div>
			<Table width="full">
				<TableHeaderRow className="grid grid-cols-4">
					{header.map(({ label }, index) => {
						return <TableHeader key={index}>{label}</TableHeader>;
					})}
					<TableHeader></TableHeader>
				</TableHeaderRow>
				<TableBody loading={isLoading}>
					{reports?.map(({ _id, link, year, createdAt, updatedAt }, index) => {
						return (
							<TableDataRow
								onClick={() => {
									setSelectedId(_id);
									handleReportModal();
									setNewItem(false);
								}}
								key={index}
								className="grid grid-cols-4 px-4 py-3 bg-white">
								<TableData>
									<span className="flex items-center gap-2">{year}</span>
								</TableData>
								<TableData>{link}</TableData>
								<TableData>
									{moment(updatedAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{moment(createdAt).format("DD MMM, YYYY")}
								</TableData>
							</TableDataRow>
						);
					})}
				</TableBody>
			</Table>
			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Report"
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isReportModalOpen && (
				<ReportModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isReportModalOpen}
					handleModal={handleReportModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default Reports;
