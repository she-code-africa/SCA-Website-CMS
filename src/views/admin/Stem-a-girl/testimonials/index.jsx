import {
	TableHeaderRow,
	TableHeader,
	TableBody,
	TableData,
	TableDataRow,
	Table,
} from "components/Table/DisplayTable";
import { useState } from "react";
import { useQuery } from "react-query";
import moment from "moment";
import TestimonialModal from "components/Stem-a-girl/testimonials/TestimonialModal";
import { getSAGTestimonials } from "services";

const Testimonials = () => {
	const [testimonials, setTestimonials] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();

	const tableHeader = [
		{
			value: "name",
			label: "Name",
		},
		{
			value: "testimony",
			label: "Testimony",
		},
		{
			value: "",
			label: "",
		},
		{
			value: "createdAt",
			label: "Created At",
		},
	];

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const { isLoading } = useQuery(
		"stem-a-girl-testimonials",
		getSAGTestimonials,
		{
			onSuccess: ({ data }) => {
				!!data && setTestimonials(data.data);
			},
			onError: (err) => {
				console.log(err);
			},
		}
	);

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Testimonials</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							handleModal();
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
						{testimonials?.map((testimonial) => (
							<TableDataRow
								key={testimonial._id}
								className="grid grid-cols-4 px-4 py-3 bg-white">
								<TableData>
									<div className="flex gap-2 items-center">
										<img
											src={testimonial.image}
											alt={testimonial.name}
											className="w-6 h-6"
										/>
										{testimonial.name}
									</div>
								</TableData>
								<TableData className="col-span-2">
									{testimonial.testimony.substring(0, 100)}...
								</TableData>
								<TableData>
									{moment(testimonial.createdAt).format("DD MMM, YYYY")}
								</TableData>
							</TableDataRow>
						))}
					</TableBody>
				</Table>
			</div>
			{isModalOpen && (
				<TestimonialModal
					isOpen={isModalOpen}
					handleModal={handleModal}
					newItem={newItem}
				/>
			)}
		</>
	);
};

export default Testimonials;
