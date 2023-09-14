import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTestimonials } from "services";
import { testimonials as header } from "utils/headers";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
	TableActions,
} from "components/Table/DisplayTable";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { paths } from "utils";
import { deleteTestimonial } from "services";
import DeleteModal from "components/Modal/DeleteModal";

const Testimonials = () => {
	const [testimonials, setTestimonials] = useState([]);
	const [selectedId, setSelectedId] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const { isLoading } = useQuery("testimonials", getTestimonials, {
		onSuccess: (data) => {
			setTestimonials(data);
		},
		onError: (err) => {
			toast.error("Could not fetch Testimonials");
		},
	});

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	const { mutate: deleteMember } = useMutation(deleteTestimonial, {
		onSuccess: () => {
			queryClient.invalidateQueries(["testimonials"]);
			handleModal();
			toast.success("Testimonial Deleted successfully");
		},
		onError: () => {
			handleModal();
			toast.error("Could not delete testimonial");
		},
	});

	const handleDelete = () => {
		deleteMember(selectedId);
	};

	return (
		<>
			<div className="w-full z-40 bg-white rounded-md">
				<div className="flex items-center justify-between px-4 mt-3">
					<h5 className="font-medium text-xl">Testimonials</h5>
					<Link
						className="rounded bg-pink-500 text-white text-xs  px-4 py-2"
						to={paths.addNewTestimonial}>
						Add
					</Link>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-[200px_1fr_100px_100px_50px] gap-x-4">
						{header.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{testimonials.map(
							(
								{
									_id,
									firstName,
									lastName,
									image,
									state,
									testimony,
									createdAt,
								},
								index
							) => {
								return (
									<TableDataRow
										key={index}
										className="grid grid-cols-[200px_1fr_100px_100px_50px] px-4 py-3 gap-x-4 bg-white">
										<TableData>
											<span className="flex items-center gap-2">
												<img
													className="w-4 h-4 rounded-full"
													src={image}
													alt={`${firstName} ${lastName}`}
												/>
												{`${firstName} ${lastName}`}
											</span>
										</TableData>

										<TableData noTruncate>{testimony}</TableData>
										<TableData>{state}</TableData>
										<TableData>
											{moment(createdAt).format("DD MMM, YYYY")}
										</TableData>
										<TableData noTruncate>
											<TableActions>
												<Link
													to={`${paths.viewTestimonial}/${_id}`}
													className="mb-1 px-3 text-sm text-left">
													View
												</Link>
												<Link
													to={`${paths.editTestimonial}/${_id}`}
													className="mb-1 px-3 text-sm text-left">
													Edit
												</Link>
												<button
													onClick={() => {
														setSelectedId(_id);

														handleModal();
													}}
													className="mb-1 px-3 text-sm text-left">
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
			</div>
			<DeleteModal
				title="Delete Testimonial"
				handleDelete={handleDelete}
				isOpen={isOpen}
				handleModal={handleModal}
			/>
			<ToastContainer />
		</>
	);
};

export default Testimonials;
