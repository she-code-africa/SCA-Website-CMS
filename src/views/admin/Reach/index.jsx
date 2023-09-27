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
import { getOurReach, deleteOurReach } from "services";
import { reach as header } from "utils/headers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";
import ReachModal from "components/Reach/ReachModal";

const ReachList = () => {
	const queryClient = useQueryClient();
	const [reach, setReach] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isReachModalOpen, setIsReachModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();

	const { isLoading } = useQuery("reachs", getOurReach, {
		onSuccess: (data) => {
			setReach(data);
		},
		onError: () => {
			toast.error("Error fetching Reach");
		},
	});

	const handleReachModal = () => {
		setIsReachModalOpen(!isReachModalOpen);
	};

	const { mutate } = useMutation(deleteOurReach, {
		onSuccess: () => {
			queryClient.invalidateQueries(["reachs"]);
			toast.success("Reach deleted Successfully");
			handleDeleteModal();
		},
		onError: () => {
			console.log("error");
			toast.error("Could not delete reach");
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
				<h5 className="font-medium text-xl">Our Reach</h5>
				<button
					className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
					onClick={() => {
						setNewItem(true);
						setSelectedId("");
						handleReachModal();
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
					{reach?.map(({ _id, value, name, createdAt, updatedAt }, index) => {
						return (
							<TableDataRow
								onClick={() => {
									setSelectedId(_id);
									handleReachModal();
									setNewItem(false);
								}}
								key={index}
								className="grid grid-cols-4 px-4 py-3 bg-white">
								<TableData>
									<span className="flex items-center gap-2">{name}</span>
								</TableData>
								<TableData>{value}</TableData>
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
					title="Delete Reach"
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isReachModalOpen && (
				<ReachModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isReachModalOpen}
					handleModal={handleReachModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default ReachList;
