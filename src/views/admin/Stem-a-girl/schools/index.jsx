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
import { getSAGSchools, deleteSAGSchool } from "services";
import moment from "moment";
import SchoolModal from "components/Stem-a-girl/schools/SchoolModal";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "components/Modal/DeleteModal";

const Schools = () => {
	const [schools, setSchools] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();

	const tableHeader = [
		{
			value: "name",
			label: "Name",
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

	const handleSchoolModal = () => {
		setIsSchoolModalOpen(!isSchoolModalOpen);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const { isLoading } = useQuery("stem-a-girl-schools", getSAGSchools, {
		onSuccess: ({ data }) => {
			!!data && setSchools(data.data);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const { mutate, isLoading: deleting } = useMutation(deleteSAGSchool, {
		onSuccess: () => {
			toast.success("School Deleted Successfully");
			queryClient.invalidateQueries(["stem-a-girl-schools"]);
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
				<div className="flex items-center justify-between px-4 py-3">
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
						{tableHeader.map(({ label, name }) => (
							<TableHeader key={name}>{label}</TableHeader>
						))}
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{schools?.map((school) => (
							<TableDataRow
								onClick={() => {
									setSelectedId(school._id);
									handleSchoolModal();
									setNewItem(false);
								}}
								key={school._id}
								className="grid grid-cols-4 px-4 py-3 bg-white">
								<TableData>
									<div className="flex gap-2 items-center">
										<img
											src={school.image}
											alt={school.name}
											className="w-6 h-6"
										/>
										{school.name}
									</div>
								</TableData>
								<TableData>{school.description.substring(0, 100)}...</TableData>
								<TableData>
									{" "}
									{moment(school.updatedAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{moment(school.createdAt).format("DD MMM, YYYY")}
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
