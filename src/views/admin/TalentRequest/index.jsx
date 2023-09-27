import React, { useState } from "react";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { useQuery } from "react-query";
import { getTalentRequests } from "services";
import { talentRequest as header } from "utils/headers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import TalentRequestModal from "components/TalentRequest/TalentRequestModal";

const TalentRequestList = () => {
	const [request, setRequest] = useState();
	const [talentRequests, setTalentRequests] = useState();
	const [isTalentRequestModalOpen, setIsTalentRequestModalOpen] =
		useState(false);

	const { isLoading } = useQuery("talentRequests", getTalentRequests, {
		onSuccess: (data) => {
			console.log(data);
			setTalentRequests(data);
			console.log(talentRequests);
		},
		onError: () => {
			toast.error("Error fetching Talent Request");
		},
	});

	const handleTalentRequestModal = () => {
		setIsTalentRequestModalOpen(!isTalentRequestModalOpen);
	};

	return (
		<div className="w-full z-40 bg-white rounded-md">
			<div className="flex items-center justify-between px-4 mt-3">
				<h5 className="font-medium text-xl">Talent Requests</h5>
			</div>

			<Table width="full">
				<TableHeaderRow className="grid grid-cols-9">
					{header.map(({ label }, index) => {
						return <TableHeader key={index}>{label}</TableHeader>;
					})}
					<TableHeader></TableHeader>
				</TableHeaderRow>
				<TableBody loading={isLoading}>
					{talentRequests?.map((data) => {
						const {
							_id,
							fullname,
							company,
							companyLink,
							email,
							experienceLevel,
							jobRole,
							jobDescription,
							createdAt,
							updatedAt,
						} = data;
						return (
							<TableDataRow
								onClick={() => {
									handleTalentRequestModal();
									setRequest(data);
								}}
								key={_id}
								className="grid grid-cols-9 px-4 py-3 bg-white">
								<TableData>{fullname}</TableData>
								<TableData>{email}</TableData>

								<TableData>{experienceLevel}</TableData>
								<TableData>{jobRole}</TableData>
								<TableData>{jobDescription}</TableData>
								<TableData>{company}</TableData>
								<TableData>{companyLink}</TableData>
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
			{isTalentRequestModalOpen && (
				<TalentRequestModal
					isOpen={isTalentRequestModalOpen}
					handleModal={handleTalentRequestModal}
					talentRequest={request}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default TalentRequestList;
