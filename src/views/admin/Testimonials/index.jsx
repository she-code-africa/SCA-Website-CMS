import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTestimonials, deleteTestimonial } from "services";
import { testimonials as header } from "utils/headers";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "components/Modal/DeleteModal";
import TestimonialModal from "components/Testimonials/TestimonialModal";

const Testimonials = () => {
	const [testimonials, setTestimonials] = useState([]);
	const [selectedId, setSelectedId] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();
	const { isLoading } = useQuery("testimonials", getTestimonials, {
		onSuccess: (data) => {
			setTestimonials(data);
		},
		onError: (err) => {
			toast.error("Could not fetch Testimonials");
		},
	});

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleTestimonialModal = () => {
		setIsTestimonialModalOpen(!isTestimonialModalOpen);
	};

	const { mutate: deleteMember } = useMutation(deleteTestimonial, {
		onSuccess: () => {
			queryClient.invalidateQueries(["testimonials"]);
			toast.success("Testimonial Deleted successfully");
			handleDeleteModal();
		},
		onError: () => {
			toast.error("Could not delete testimonial");
			handleDeleteModal();
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
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleTestimonialModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-[200px_1fr_100px_100px_100px_100px] gap-x-4">
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
									updatedAt,
									publishDate,
								},
								index
							) => {
								return (
									<TableDataRow
										onClick={() => {
											setSelectedId(_id);
											handleTestimonialModal();
											setNewItem(false);
										}}
										key={index}
										className="grid grid-cols-[200px_1fr_100px_100px_100px_100px] px-4 py-3 gap-x-4 bg-white">
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
											{moment(publishDate).format("DD MMM, YYYY")}
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
					title="Delete Testimonial"
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}

			{isTestimonialModalOpen && (
				<TestimonialModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isTestimonialModalOpen}
					handleModal={handleTestimonialModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Testimonials;
