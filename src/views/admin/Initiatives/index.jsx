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
	TableActions,
} from "components/Table/DisplayTable";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { paths } from "utils";

const Initiatives = () => {
	const [initiatives, setInitiatives] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
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
		},
		onError: () => {
			console.log("error");
			toast.error("Could not delete initiative");
		},
	});

	const handleDelete = () => {
		mutate(selectedId);
	};

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="w-full z-40 bg-white rounded-md">
			<div className="flex items-center justify-between px-4 mt-3">
				<h5 className="font-medium text-xl">Initiatives</h5>
				<Link
					to={paths.addNewScholarship}
					className="rounded bg-pink-500 text-white text-xs  px-4 py-2">
					Add
				</Link>
			</div>

			<Table width="full">
				<TableHeaderRow className="grid grid-cols-5">
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
									key={index}
									className="grid grid-cols-5 px-4 py-3 bg-white">
									<TableData>{name}</TableData>

									<TableData>{description}</TableData>
									<TableData>{link}</TableData>
									<TableData>
										{moment(createdAt).format("DD MMM, YYYY")}
									</TableData>
									<TableData noTruncate>
										<TableActions>
											<Link
												to={`${paths.viewScholarship}/${_id}`}
												className="mb-1 px-3 text-sm text-left">
												View
											</Link>
											<Link
												to={`${paths.editScholarship}/${_id}`}
												className="mb-1 px-3 text-sm text-left">
												Edit
											</Link>
											<button
												className="mb-1 px-3 text-sm text-left"
												onClick={() => {
													setSelectedId(_id);
													handleModal();
												}}>
												Delete
											</button>
										</TableActions>
									</TableData>
								</TableDataRow>
							);
						}
					)}
				</TableBody>
			</Table>
			<DeleteModal
				title="Delete Team Member"
				handleDelete={handleDelete}
				isOpen={isOpen}
				handleModal={handleModal}
			/>
			<ToastContainer />
		</div>
	);
};

export default Initiatives;
