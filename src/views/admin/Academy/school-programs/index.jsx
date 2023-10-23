import { useMutation, useQuery, useQueryClient } from "react-query";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import { schoolPrograms as headers } from "utils/headers";
import { getSchoolPrograms } from "services";
import moment from "moment";
import SchoolProgramModal from "components/SchoolPrograms/SchoolProgramModal";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import { deleteSchool } from "services";

const SchoolPrograms = () => {
	const [schoolPrograms, setSchoolPrograms] = useState([]);
	const [isSchoolProgramModalOpen, setIsSchoolProgramModalOpen] =
		useState(false);
	const [newItem, setNewItem] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState();

	const { isLoading } = useQuery("schoolPrograms", getSchoolPrograms, {
		onSuccess: (data) => {
			setSchoolPrograms(data);
		},
		onError: (err) => {
			toast.error("Could not fetch SchoolPrograms");
		},
	});

	const queryClient = useQueryClient();

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleSchoolProgramModal = () => {
		setIsSchoolProgramModalOpen(!isSchoolProgramModalOpen);
	};

	const { mutate, isLoading: deleting } = useMutation(deleteSchool, {
		onSuccess: () => {
			toast.success("School Programs Deleted Successfully");
			queryClient.invalidateQueries(["schoolPrograms"]);
		},
		onError: () => {
			toast.error("Could not delete School Program");
		},
	});
	const handleDelete = () => {
		mutate(selectedId);
		handleDeleteModal();
	};

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-2 ">
					<h5 className="font-medium text-xl mt-3">School Programs</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleSchoolProgramModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-8">
						{headers.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading || deleting}>
						{schoolPrograms.map(
							(
								{
									_id,
									title,
									cohort,
									briefContent,
									school,
									state,
									publishDate,
									updatedAt,
									createdAt,
								},
								index
							) => {
								return (
									<TableDataRow
										onClick={() => {
											setSelectedId(_id);
											handleSchoolProgramModal();
											setNewItem(false);
										}}
										key={index}
										className="grid grid-cols-8 px-4 py-3 bg-white">
										<TableData>{title}</TableData>
										<TableData>{cohort}</TableData>
										<TableData>{briefContent}</TableData>
										<TableData>{school.name}</TableData>
										<TableData>{state}</TableData>
										<TableData>
											{publishDate
												? moment(publishDate).format("DD MMM, YYYY")
												: "N/A"}
										</TableData>
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
				</Table>
			</div>
			{isDeleteModalOpen && (
				<DeleteModal
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isSchoolProgramModalOpen && (
				<SchoolProgramModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isSchoolProgramModalOpen}
					handleModal={handleSchoolProgramModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default SchoolPrograms;
