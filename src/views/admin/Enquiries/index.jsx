import React, { useEffect, useState } from "react";
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

const Enquiries = () => {
	const [enquiries, setEnquiries] = useState([]);
	const [selectedId, setSelectedId] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
	const [deleteEnquiry, setDeleteEnquiry] = useState(false);

	const { isLoading, data } = useQuery("enquiries", getEnquiries, {
		onError: () => {
			toast.error("Error Fetching Enquiries");
		},
	});
	useEffect(() => {
		setEnquiries(data);
	}, [data]);

	const handleEnquriesModal = () => {
		setIsEnquiryModalOpen(!isEnquiryModalOpen);
	};

	return (
		<>
			<div className="w-full z-40 bg-white rounded-md">
				<div className="flex items-center justify-between px-4 mt-3">
					<h5 className="font-medium text-xl">Enquiries</h5>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-6 gap-x-4">
						{header.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{enquiries
							?.slice(
								(currentPage - 1) * itemsPerPage,
								currentPage * itemsPerPage
							)
							.map(
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
											className="grid grid-cols-6 px-4 py-3 gap-x-4 bg-white"
											onClick={() => {
												setSelectedId(_id);
												handleEnquriesModal();
											}}>
											<TableData>
												<span>{fullName}</span>
											</TableData>
											<TableData>{email}</TableData>
											<TableData noTruncate>{description}</TableData>
											<TableData noTruncate>{status}</TableData>
											<TableData>
												{moment(createdAt).format("DD MMM, YYYY")}
											</TableData>
											<TableData noTruncate>
												{moment(updatedAt).format("DD MMM, YYYY")}
											</TableData>
										</TableDataRow>
									);
								}
							)}
					</TableBody>
					<Pagination
						totalItems={enquiries?.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
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
