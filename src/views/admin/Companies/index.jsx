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

const Companies = () => {
	const [companies, setCompanies] = useState([]);
	const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");

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
			<div className="flex w-full self-start">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4 z-40">
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[1fr_1fr_1fr_200px_100px_100px_100px]">
								{companyHeader.map(({ label }, index) => {
									return <TableHeader key={index}>{label}</TableHeader>;
								})}
								<TableHeader></TableHeader>
							</TableHeaderRow>
							<TableBody loading={isLoading}>
								<>
									{isLoading ? (
										<div className="min-h-[200px] flex items-center">
											<BarrLoader />
										</div>
									) : (
										<>
											{companies.map(
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
									)}
								</>
							</TableBody>
						</Table>
					</div>
				)}
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
