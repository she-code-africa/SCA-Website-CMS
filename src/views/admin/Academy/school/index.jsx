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
import { schools as headers } from "utils/headers";
import { getSchools } from "services";
import moment from "moment";
import SchoolModal from "components/Schools/SchoolModal";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import { deleteSchool } from "services";

const Schools = () => {
	const [schools, setSchools] = useState([]);
	const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState();

	const { isLoading } = useQuery("schools", getSchools, {
		onSuccess: (data) => {
			setSchools(data);
		},
		onError: (err) => {
			toast.error("Could not fetch Schools");
		},
	});

	const queryClient = useQueryClient();

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleSchoolModal = () => {
		setIsSchoolModalOpen(!isSchoolModalOpen);
	};

	const { mutate, isLoading: deleting } = useMutation(deleteSchool, {
		onSuccess: () => {
			toast.success("School Deleted Successfully");
			queryClient.invalidateQueries(["schools"]);
		},
		onError: () => {
			toast.error("Could not delete School");
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
					<h5 className="font-medium text-xl mt-3">Schools</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleSchoolModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-4">
						{headers.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading || deleting}>
						{schools.map(
							({ _id, name, description, updatedAt, createdAt }, index) => {
								return (
									<TableDataRow
										onClick={() => {
											setSelectedId(_id);
											handleSchoolModal();
											setNewItem(false);
										}}
										key={index}
										className="grid grid-cols-4 px-4 py-3 bg-white">
										<TableData>{name}</TableData>
										<TableData>{description}</TableData>
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
			{isSchoolModalOpen && (
				<SchoolModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isSchoolModalOpen}
					handleModal={handleSchoolModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Schools;
