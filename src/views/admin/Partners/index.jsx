import React, { useState } from "react";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPartners, deletePartner } from "services";
import { partners as header } from "utils/headers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";
import PartnerModal from "components/Partners/PartnerModal";

const PartnersList = () => {
	const queryClient = useQueryClient();
	const [partners, setPartners] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();

	const { isLoading } = useQuery("partners", getPartners, {
		onSuccess: (data) => {
			setPartners(data);
		},
		onError: () => {
			toast.error("Error fetching Partners");
		},
	});

	const handlePartnerModal = () => {
		setIsPartnerModalOpen(!isPartnerModalOpen);
	};

	const { mutate } = useMutation(deletePartner, {
		onSuccess: () => {
			queryClient.invalidateQueries(["partners"]);
			toast.success("Partner deleted Successfully");
			handleDeleteModal();
		},
		onError: () => {
			console.log("error");
			toast.error("Could not delete partner");
		},
	});

	const handleDelete = () => {
		mutate(selectedId);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	return (
		<div className="w-full z-40 bg-white rounded-md">
			<div className="flex items-center justify-between px-4 mt-3">
				<h5 className="font-medium text-xl">Partners</h5>
				<button
					className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
					onClick={() => {
						setNewItem(true);
						setSelectedId("");
						handlePartnerModal();
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
					{partners?.map(
						({ _id, image, featured, name, createdAt, updatedAt }, index) => {
							return (
								<TableDataRow
									onClick={() => {
										setSelectedId(_id);
										handlePartnerModal();
										setNewItem(false);
									}}
									key={index}
									className="grid grid-cols-4 px-4 py-3 bg-white">
									<TableData>
										<span className="flex items-center gap-2">
											<img className="w-4 h-4" src={image} alt={name} />
											{name}
										</span>
									</TableData>
									<TableData>{featured ? "Yes" : "No"}</TableData>
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
			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Partner"
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isPartnerModalOpen && (
				<PartnerModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isPartnerModalOpen}
					handleModal={handlePartnerModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default PartnersList;
