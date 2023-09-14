import React, { useState } from "react";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
	TableActions,
} from "components/Table/DisplayTable";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPartners } from "services";
import { partners as header } from "utils/headers";
import { deletePartner } from "services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { paths } from "utils";
import DeleteModal from "components/Modal/DeleteModal";

const PartnersList = () => {
	const queryClient = useQueryClient();
	const [partners, setPartners] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const { isLoading } = useQuery("partners", getPartners, {
		onSuccess: (data) => {
			setPartners(data);
		},
		onError: () => {
			toast.error("Error fetching Partners");
		},
	});
	const { mutate } = useMutation(deletePartner, {
		onSuccess: () => {
			queryClient.invalidateQueries(["partners"]);
			toast.success("Partner deleted Successfully");
		},
		onError: () => {
			console.log("error");
			toast.error("Could not delete partner");
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
				<h5 className="font-medium text-xl">Partners</h5>
				<Link
					to={paths.addPartner}
					className="rounded bg-pink-500 text-white text-xs  px-4 py-2">
					Add
				</Link>
			</div>

			<Table width="full">
				<TableHeaderRow className="grid grid-cols-4">
					{header.map(({ label }, index) => {
						return <TableHeader key={index}>{label}</TableHeader>;
					})}
					<TableHeader></TableHeader>
				</TableHeaderRow>
				<TableBody loading={isLoading}>
					{partners?.map(({ _id, image, featured, name, createdAt }, index) => {
						return (
							<TableDataRow
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
									{moment(createdAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData noTruncate>
									<TableActions>
										<Link
											to={`${paths.editPartner}/${_id}`}
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
					})}
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

export default PartnersList;
