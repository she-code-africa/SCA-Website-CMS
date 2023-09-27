import React, { useState } from "react";
import { initiatives as header } from "utils/headers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getInitiatives } from "services";
import { deleteInitiative } from "services";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import InitiativeModal from "components/Initiative/InitiativeModal";

const Initiatives = () => {
	const [initiatives, setInitiatives] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isInitiativeModalOpen, setIsInitiativeModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();
	const { isLoading } = useQuery("initiatives", getInitiatives, {
		onSuccess: (data) => {
			setInitiatives(data);
		},
		onError: () => {
			toast.error("Error fetching Initatives");
		},
	});
	const { mutate } = useMutation(deleteInitiative, {
		onSuccess: () => {
			queryClient.invalidateQueries("initiatives");
			toast.success("Initiatives deleted Successfully");
			handleDeleteModal();
		},
		onError: () => {
			console.log("error");
			toast.error("Could not delete initiative");
		},
	});

	const handleDelete = () => {
		mutate(selectedId);
	};

	const handleInitiativeModal = () => {
		setIsInitiativeModalOpen(!isInitiativeModalOpen);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	return (
		<div className="w-full z-40 bg-white rounded-md">
			<div className="flex items-center justify-between px-4 mt-3">
				<h5 className="font-medium text-xl">Initiatives</h5>
				<button
					className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
					onClick={() => {
						setNewItem(true);
						setSelectedId("");
						handleInitiativeModal();
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
					{initiatives?.map(
						({ _id, name, description, link, createdAt }, index) => {
							return (
								<TableDataRow
									onClick={() => {
										setSelectedId(_id);
										handleInitiativeModal();
										setNewItem(false);
									}}
									key={index}
									className="grid grid-cols-4 px-4 py-3 bg-white">
									<TableData>{name}</TableData>
									<TableData>{description}</TableData>
									<TableData>{link}</TableData>
									<TableData>
										{moment(createdAt).format("DD MMM, YYYY")}
									</TableData>
								</TableDataRow>
							);
						}
					)}
				</TableBody>
			</Table>
			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Initative"
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isInitiativeModalOpen && (
				<InitiativeModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isInitiativeModalOpen}
					handleModal={handleInitiativeModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default Initiatives;
