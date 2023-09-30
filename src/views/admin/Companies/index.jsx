import React, { useState } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";
import { companies as companyHeader } from "utils/headers";
import Loader from "components/Loader";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { BarrLoader } from "components/Loader";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyModal from "components/Companies/CompanyModal";
import Pagination from "components/Pagination";

const Companies = () => {
	const [companies, setCompanies] = useState([]);
	const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const { isLoading } = useQuery("companies", getCompanies, {
		onSuccess: (data) => {
			setCompanies(data);
		},
		onError: () => {
			toast.error("Could not fetch Companies");
		},
	});

	const handleCompanyModal = () => {
		setIsCompanyModalOpen(!isCompanyModalOpen);
	};
	return (
		<>
			<div className="w-full z-10 bg-white rounded-md h-fit">
				<div className="flex items-center justify-between px-4 mt-3">
					<h5 className="font-medium text-xl">Companies</h5>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-[1fr_1fr_1fr_200px_100px_100px_100px]">
						{companyHeader.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						<>
							{companies
								?.slice(
									(currentPage - 1) * itemsPerPage,
									currentPage * itemsPerPage
								)
								.map(
									(
										{
											_id,
											companyName,
											email,
											companyLocation,
											state,
											companyPhone,
											updatedAt,
											createdAt,
										},
										index
									) => {
										return (
											<TableDataRow
												key={index}
												onClick={() => {
													setSelectedId(_id);
													handleCompanyModal();
												}}
												className="grid grid-cols-[1fr_1fr_1fr_200px_100px_100px_100px] px-4 py-3 bg-white">
												<TableData>
													<span>{companyName}</span>
												</TableData>
												<TableData>{email}</TableData>
												<TableData>{companyLocation}</TableData>
												<TableData>{companyPhone}</TableData>
												<TableData>{state}</TableData>
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
						</>
					</TableBody>
					<Pagination
						totalItems={companies?.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
				</Table>
			</div>
			{isCompanyModalOpen && (
				<CompanyModal
					isOpen={isCompanyModalOpen}
					handleModal={handleCompanyModal}
					id={selectedId}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Companies;
