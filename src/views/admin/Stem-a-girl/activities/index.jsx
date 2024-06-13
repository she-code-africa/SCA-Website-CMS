import {
	TableHeaderRow,
	TableHeader,
	TableBody,
	TableData,
	TableDataRow,
	Table,
} from "components/Table/DisplayTable";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSAGActivities, deleteSAGActivity } from "services";
import moment from "moment";
import ActivityModal from "components/Stem-a-girl/activities/ActivityModal";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "components/Modal/DeleteModal";

const Activities = () => {
	const [activities, setActivities] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();

	const tableHeader = [
		{
			value: "title",
			label: "Title",
		},
		{
			value: "description",
			label: "Description",
		},
		{
			value: "updatedAt",
			label: "Updated At",
		},
		{
			value: "createdAt",
			label: "Created At",
		},
	];

	const handleActivityModal = () => {
		setIsActivityModalOpen(!isActivityModalOpen);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const { isLoading } = useQuery("stem-a-girl-activities", getSAGActivities, {
		onSuccess: ({ data }) => {
			!!data && setActivities(data.data);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const { mutate, isLoading: deleting } = useMutation(deleteSAGActivity, {
		onSuccess: () => {
			toast.success("Activity Deleted Successfully");
			queryClient.invalidateQueries(["stem-a-girl-activities"]);
		},
		onError: () => {
			toast.error("Could not delete Activity");
		},
	});
	const handleDelete = () => {
		mutate(selectedId);
		handleDeleteModal();
	};

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Activities</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleActivityModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-4">
						{tableHeader.map(({ label, name }) => (
							<TableHeader key={name}>{label}</TableHeader>
						))}
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{activities?.map((activity) => (
							<TableDataRow
								onClick={() => {
									setSelectedId(activity._id);
									handleActivityModal();
									setNewItem(false);
								}}
								key={activity._id}
								className="grid grid-cols-4 px-4 py-3 bg-white">
								<TableData>
									<div className="flex gap-2 items-center">
										<img
											src={activity.image}
											alt={activity.title}
											className="w-6 h-6"
										/>
										{activity.title}
									</div>
								</TableData>
								<TableData>
									{activity.description.substring(0, 100)}...
								</TableData>
								<TableData>
									{" "}
									{moment(activity.updatedAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{moment(activity.createdAt).format("DD MMM, YYYY")}
								</TableData>
							</TableDataRow>
						))}
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
			{isActivityModalOpen && (
				<ActivityModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isActivityModalOpen}
					handleModal={handleActivityModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Activities;
